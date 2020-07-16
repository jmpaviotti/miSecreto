const express = require('express');
const router = express.Router();
const db = require('../db');
const h = require('./help');
const { query } = require('express');

// Main feed + Pagination
router.get('/', (req, res) => {
  if (!req.session.votes) {
    req.session.votes = {};
  }

  h.getPageData(req.query).then((pageData) => {
    const query = h.sanitizeQuery(req.query, pageData.current)

    if (pageData.current >= 1) {
      db.query(query)
        .then((data) => {
          // console.log(data)
          res.render('index', {
            rows: data.rows,
            pages: pageData,
            votes: req.session.votes,
          })
        })
        .catch((e) => console.error(e.stack));
    } else {
      res.redirect('/');
    }
  });
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
  res.redirect('/');
});

// Get session votes
router.get('/vote', (req, res) => {
  res.send(req.session.votes);
});

// Voting
router.post('/vote', (req, res) => {
  const { id, vote } = req.body;
  const userVotes = req.session.votes;

  if (!userVotes[id]) {
    db.query(`UPDATE secretos SET votes = votes + ${vote} WHERE id = ${id}`)
      .then(() => {
        userVotes[id] = vote; // Track vote
        db.query(`SELECT votes FROM secretos WHERE id = ${id}`)
          .then((data) => {
            res.send(data.rows[0]);
          })
          .catch((e) => console.error(e.stack));
      })
      .catch((e) => console.error(e.stack));
  } else if (userVotes[id] == vote) {
    db.query(`UPDATE secretos SET votes = votes - ${vote} WHERE id = ${id}`) // Undo vote from DB
      .then(() => {
        delete userVotes[id]; // Undo vote from session
        db.query(`SELECT votes FROM secretos WHERE id = ${id}`)
          .then((data) => {
            res.send(data.rows[0]);
          })
          .catch((e) => console.error(e.stack));
      })
      .catch((e) => console.error(e.stack));
  } else {
    db.query(`UPDATE secretos SET votes = votes + ${vote * 2} WHERE id = ${id}`) // Undo vote from DB + Count other vote
      .then(() => {
        userVotes[id] = vote; // Update session vote
        db.query(`SELECT votes FROM secretos WHERE id = ${id}`)
          .then((data) => {
            res.send(data.rows[0]);
          })
          .catch((e) => console.error(e.stack));
      })
      .catch((e) => console.error(e.stack));
  }
});

module.exports = router;
