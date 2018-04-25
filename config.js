require('dotenv').load();

module.exports = {
    server: {
      host: process.env.APP_HOST || 'localhost',
      port: process.env.APP_PORT || 3000,
    },
    database: {
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_DATABASE || `${__dirname}/app/utils/db.json`,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
    },
    paths: {
      video: `${__dirname}/app/public/videos`,
      image: `${__dirname}/app/public/images`,
      thumb: `${__dirname}/app/public/images/thumbs`
    }
};
