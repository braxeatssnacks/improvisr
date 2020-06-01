#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const download = require('youtube-dl');

const config = require('../../config.js');

const {
  thumb: THUMB_DIRECTORY,
  video: VIDEO_DIRECTORY,
} = config.paths;
const { database: DATABASE_FPATH } = config.database;

/**
 * Assumes absolute path.
 */
const mkdirSync = (dir) => {
  const { sep } = path;
  const baseDir = '/'; // ensure we use the root dir to resolve.

  dir.split(sep).reduce((parentDir, childDir) => {
    const currentDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(currentDir);
    } catch (err) {
      const { code } = err;
      // already exists
      if (code === 'EEXIST') {
        return currentDir;
      } if (code === 'ENOENT') {
        throw new Error(
          `EACCES: permission denied, mkdir '${parentDir}'`
        );
      }
      throw err;
    }
    return currentDir;
  });
};

const ensureDirExists = (dir) =>  {
  if (!fs.existsSync(dir)) {
    mkdirSync(dir);
  }
};

ensureDirExists(THUMB_DIRECTORY);
ensureDirExists(VIDEO_DIRECTORY);

/**
 * Write db to filesystem.
 */
const writeDatabase = (db) => {
  fs.writeFileSync(DATABASE_FPATH, JSON.stringify(db, null, 4));
}

/**
 * Read from existing or generate new db structure.
 */
const initializeDatabase = () => {
  let db;
  let reset = () => {};
  try {
    db = JSON.parse(fs.readFileSync(DATABASE_FPATH));
    reset = () => {
      console.log('Writing backup database');
      writeDatabase(db);
    };
  } catch(err) {
    db = { videos: {} };
  }
  return [db, reset];
};

/**
 * Add video into db!
 */
const addVideoEntry = (db, key, entry) => {
  db['videos'][key] = entry;
};

/**
 * Provided structured YouTube info, create db entry object.
 */
const generateDatabaseEntry = (info) => ({
  id: info.id,
  descr: info.description,
  duration: info.duration,
  raw_duration: info._duration_raw,
  fpath: `videos/${info.id}.mp4`,
  height: info.height,
  width: info.width,
  thumb: `images/thumbs/${info.id}.jpg`,
  title: info.title,
  uploader: info.uploader,
  uploaderId: info.uploader_id,
  url: info.webpage_url
});

const writeThumbnail = (info, fpath) => {
  fs.renameSync(`${THUMB_DIRECTORY}/${info}`, fpath);
  console.log(`thumbnail for video ${id} downloaded!`);
};

/**
 * Provided a link, retrieve video.
 */
const downloadVideo = (link, db) => new Promise((resolve, reject) => {
  const id = link.match(/(?<=v=).+$/)[0];
  const videoFpath = `${VIDEO_DIRECTORY}/${id}.mp4`;

  const downloaded = fs.existsSync(videoFpath)
    ? fs.statSync(videoFpath).size
    : 0;

  const video = download(
    link,
    ['--format=18'],
    { start: downloaded, cwd: VIDEO_DIRECTORY }
  );

  // Progressive write to filesystem
  video.pipe(fs.createWriteStream(videoFpath, { flags: 'a' }));

  // Already completed!
  video.on('complete', (info) => {
    console.log(`youtube video ${id} already downloaded!`);
    resolve();
  });

  // Download in progress
  video.on('info', ({ size }) => {
    console.log(`youtube video ${id} downloading...`);
    const resuming = downloaded > 0
      ? ''
      : `resuming from ${downloaded} bytes; `;
    console.log(`${resuming}${size} bytes left...`);
  });

  // Finished download
  video.on('end', () => {
    // Grab Thumbnail
    const thumbnailFpath = `${THUMB_DIRECTORY}/${id}.jpg`
    if (!fs.existsSync(thumbnailFpath)) {
      download.getThumbs(
        link,
        { all: false, cwd: THUMB_DIRECTORY },
        (err, info) => {
          try {
            if (err) throw err;
            writeThumbnail(info[0], thumbnailFpath);
          } catch (err) {
            console.log('Failed to write thumbnail to filesystem');
          }
        }
      );
    }

    // Update DB
    download.getInfo(link, [], (err, info) => {
      try {
        if (err) throw err;
        const { id } = info;
        const entry = generateDatabaseEntry(info);
        addVideoEntry(db, id, entry);
        resolve();
      } catch (err) {
        console.log('Sheesh! Error grabbing video:', err);
        reject();
      }
    });
  });
});

/**
 * Mook, always do the right thing.
 */
const main = (...links) => {
  const [db, reset] = initializeDatabase();
  const downloads = links.map(link => downloadVideo(link, db));
  // Write to db, upon resolution of all downloads
  Promise.all(downloads)
    .then(() => {
      writeDatabase(db);
      console.log('Finished!');
    })
    .catch((err) => {
      console.log("Yikes! Something wen't wrong!", err);
      reset();
    });
};

const args = process.argv.slice(2);
if (args.length < 1) return console.error('No arguments passed.');

main(args[0]);
