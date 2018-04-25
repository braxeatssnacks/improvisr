module.exports = (modules) => {
  let router = modules.app;

  router.post('/api/video', (req, resp) => {
    resp.send('');
  });
};
