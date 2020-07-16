const { Pool } = require('pg');

// Enviroment variables config
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool();

module.exports = {
  query: (text, params, callback) => {
   return pool.query(text, params, callback)
  }
}