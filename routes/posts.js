const express = require('express');
const router = express.Router();
const db = require('../db');

// Get posts
router.get('/', (req, res) => {
  db.query('SELECT * FROM secretos LIMIT 10', (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rows);
    }
  });
});

// Submit post

// Search and refine

//
module.exports = router;
