require('dotenv').load();

module.exports = {
    server: {
      host: process.env.APP_HOST || 'localhost',
      port: process.env.APP_PORT || 3000,
    },
    database: {
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_DATABASE || 'dbName',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      max: 10,                           // maxmimum number of clients in pool
      idleTimeoutMillis: 3000            // how long client can remain idle
    }
};
