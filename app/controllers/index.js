/* INDEX PAGE */
module.exports = (modules) => {
  let router = modules.app;

  router.get('/', (req, resp) => {
    resp.send('Hello World!');
  });
};
