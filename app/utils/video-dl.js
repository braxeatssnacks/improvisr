#!/usr/bin/env node

const fs = require('fs');
const download = require('youtube-dl');

const config = require(`${__dirname}/../../config.js`);

let db;
try {
  db = JSON.parse(fs.readFileSync(config.database.database));
} catch(err) {
  db = {};
}
let old_db = Object.assign({}, db);

let __videos = config.paths.video;
let __thumbs = config.paths.thumb;

let args = process.argv.slice(2);
if (args.length < 1) return console.error('No arguments passed.');

let ids = [];
args.forEach((link) => {
  let downloaded = 0;
  let id = link.match(/(?<=v=).+$/)[0];

  let fpath = `${__videos}/${id}.mp4`;
  if (fs.existsSync(fpath)) downloaded = fs.statSync(fpath).size;

  let video = download(
    link,
    ['--format=18'],
    { start: downloaded, cwd: __videos }
  );

  video.on('info', (info) => {
    console.log(`youtube video ${id} downloading...`);
    let resuming = downloaded > 0 ? '' : `resuming from ${downloaded} bytes; `;
    console.log(`${resuming}${info.size} bytes left...`);
  });

  // write to location
  video.pipe(fs.createWriteStream(fpath, { flags: 'a' }));

  video.on('complete', (info) => {
    console.log(`youtube video ${id} already downloaded!`);
  });

  video.on('end', () => {
    let new_fpath = `${__thumbs}/${id}.jpg`;
    if (fs.existsSync(new_fpath)) {
      console.log(`thumbnail for video ${id} already downloaded!`);
    } else {
      // grab thumbnails
      download.getThumbs(link, { all: false, cwd: __thumbs }, (err, info) => {
        if (err) return console.log('sheesh! error grabbing thumbnails:', err);
        fs.renameSync(`${__thumbs}/${info[0]}`, new_fpath);
        console.log(`thumbnail for video ${id} downloaded!`);
      });
    }

    if (db.hasOwnProperty(id)) {
      console.log(`video entry already in db`);
    } else {
      // update db
      download.getInfo(link, [], (err, info) => {
        if (err) return console.log('sheesh! error grabbing info:', err);

        console.assert(info.id == id, `WARNING: info id and video id mismatch`);
        let key = info.id;
        let entry = {
          id: key,
          title: info.title,
          fpath: fpath,
          thumb: new_fpath,
          uploader: info.uploader,
          descr: info.description,
          duration: info.duration,
          url: info.url
        };

        db[key] = entry;
        fs.writeFileSync(config.database.database, JSON.stringify(db, null, 2));
        console.log('db write successful!');
      });
    }
  });

  /* TODO makeshift database versioning */

});
