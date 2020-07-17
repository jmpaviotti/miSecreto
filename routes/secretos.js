const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require("../lib/util");
const queries = require("../lib/query");

// Main feed + Pagination
router.get("/", (req, res) => {
  if (!req.session.votes) {
    req.session.votes = {};
  }

  util.getPageData(req.query).then((pageData) => {
    if (pageData.current >= 1) {
      db.query(queries.selectQuery(req.query, pageData.current, pageData.terms))
        .then((data) => {
          res.render("index", {
            rows: data.rows,
            pages: pageData,
            votes: req.session.votes,
          });
        })
        .catch((e) => console.error(e.stack));
    } else {
      res.redirect("/");
    }
  });
});

// Add secreto
router.post("/add", (req, res) => {
  let { author, gender, age, content } = req.body;
  const errors = util.validateInsert(req.body);

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
  res.redirect("/");
});

// Get session votes
router.get("/vote", (req, res) => {
  res.send(req.session.votes);
});

// Voting
router.post("/vote", (req, res) => {
  const { id, vote } = req.body;
  const userVotes = req.session.votes;

  db.query(queries.voteQuery(id, vote, userVotes))
    .then(() =>
      db
        .query(`SELECT votes FROM secretos WHERE id = $1`, [id])
        .then((data) => {
          res.send(data.rows[0]);
        })
        .catch((e) => console.error(e.stack))
    )
    .catch((e) => console.error(e.stack));
});

module.exports = router;
