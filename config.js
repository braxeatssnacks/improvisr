require('dotenv').load();

module.exports = {
    server: {
      host: process.env.APP_HOST || 'localhost',
      port: process.env.APP_PORT || 3000,
    },
    database: {
      user: process.env.PG_USER || 'user',
      password: process.env.PG_PASSWORD || 'secret',
      database: process.env.PG_DATABASE || 'dbName',
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      max: 10,                           // maxmimum number of clients in pool
      idleTimeoutMillis: 3000            // how long client can remain idle
    }
};
