module.exports = (modules) => {
  const router = modules.app;
  const videos = modules.db.videos;

  const Video = require(`${__dirname}/../models/video.js`);

  router.get('/api/videos', (req, resp) => {
    if (typeof req.query.id != 'undefined') {
      Video.findById(videos, req.query.id, (err, data) => {
        if (err) {
          resp.send(JSON.stringify({ data: null }));
        } else {
          resp.send(JSON.stringify(data));
        }
      });
    } else {
      Video.all(videos, (err, data) => {
        resp.send(JSON.stringify(data));
      });
    }
  });
};
