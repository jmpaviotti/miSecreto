const express = require('express');
const router = express.Router();
const db = require('../db');

// Main feed + Pagination
router.get('/', (req, res) => {
  const { page = 1 } = req.query;
  const pageData = {
    previous: Number(page) - 1,
    current: Number(page),
    next: Number(page) + 1,
    total: 1,
  };

  db.query('SELECT COUNT(*) FROM secretos')
    .then((data) => (pageData.total = Math.ceil(data.rows[0].count / 10)))
    .catch((e) => console.error(e.stack));

  if (page >= 1) {
    db.query(
      `SELECT * FROM secretos ORDER BY id DESC LIMIT 10 OFFSET ${
        (page - 1) * 10
      }`
    )
      .then((data) => res.render('index', { rows: data.rows, pages: pageData }))
      .catch((e) => console.error(e.stack));
  } else {
    res.sendStatus(404);
  }
});

// Add secreto
router.post('/add', (req, res) => {
  let { author, gender, age, content } = req.body;
  let errors = [];

  if (!author) {
    errors.push({ text: 'Nombre inválido.' });
  }

  if (!gender) {
    errors.push({ text: 'Seleccione género.' });
  }

  if (age < 18 || age > 100) {
    errors.push({ text: 'Edad inválida' });
  }

  if (content.length < 10) {
    errors.push({ text: 'Secreto muy corto.' });
  } else if (content.length > 500) {
    errors.push({ text: 'Secreto muy largo.' });
  }

  if (errors.length === 0) {
    const text =
      "INSERT INTO secretos (content, date, time, author, gender, age) VALUES($1, 'now', 'now', $2, $3, $4)";
    const values = [content, author, gender, age];

    db.query(text, values)
      .then((r) => {
        console.log('Successful "Insert" query.');
      })
      .catch((e) => console.error(e.stack));
  } else {
    console.log('Caught invalid "Insert" query.');
  }
  res.redirect('back');
});

module.exports = router;
