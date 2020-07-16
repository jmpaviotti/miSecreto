const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/secretos');
});

router.get('/add', function(req, res) {
  res.render('add')
});

module.exports = router;
