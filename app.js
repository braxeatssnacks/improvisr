const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const hbs = require('express-hbs');
const sass = require('node-sass-middleware');

const config = require('./config.js');
const db = JSON.parse(fs.readFileSync(config.database.database));

const app = express();

// view engine config
app.engine('hbs', hbs.express4({
  defaultLayout: `${__dirname}/app/views/layouts/main.hbs`,
  layoutsDir: `${__dirname}/app/views/layouts`,
  partialsDir: `${__dirname}/app/views/partials`
}))

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/app/views`);

// middleware for parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// middleware for static assets
app.use(sass({
  src: `${__dirname}/app/sass`,
  dest: `${__dirname}/app/public/styles`,
  debug: true,
  force: true,
  outputStyle: 'nested'
}));
app.use(express.static(`${__dirname}/app/public`));
app.use('/favicon.ico', express.static(`${__dirname}/app/public/images/favicon.ico`));

const modules = {
  app: app,
  bodyParser: bodyParser,
  config: config,
  db: db, // readonly
  express: express,
  fs: fs
};

// register routes
fs.readdirSync(`${__dirname}/app/controllers`).forEach((fname) => {
  if (~fname.indexOf('.js')) require(`${__dirname}/app/controllers/${fname}`)(modules);
});

app.listen(config.server.port, config.server.host, () => {
  console.log(`Webserver started @ http://${config.server.host}:${config.server.port}`);
});

// exit with grace
let gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully...');
  fs.writeFileSync(config.database.database, JSON.stringify(db));
  console.log('Successfuly wrote to db');
  process.exit()
};

process.on ('SIGTERM', gracefulShutdown);
process.on ('SIGINT', gracefulShutdown);
