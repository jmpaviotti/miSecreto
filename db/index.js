const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Enviroment variables confighero
// const dotenv = require("dotenv");
// dotenv.config();

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
