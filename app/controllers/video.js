module.exports = (modules) => {
  const router = modules.app;
  const videos = modules.db.videos;

  const Video = require(`${__dirname}/../models/video.js`);

  router.get('/api/videos/:id?', (req, resp) => {
    if (typeof req.params.id != 'undefined') {
      Video.findById(videos, req.params.id, (err, data) => {
        console.log(data);
        resp.send(JSON.stringify(data));
      });
    } else {
      Video.all(videos, (err, data) => {
        resp.send(JSON.stringify(data));
      });
    }
  });
};
