/* APP VIEW */
module.exports = (modules) => {
  let router = modules.app;

  router.get('/', (req, resp) => {
    resp.render('index');
  });
};
