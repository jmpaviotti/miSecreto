const express = require('express');
const handlebars = require('express-handlebars');
const helpers = require('./lib/helpers');

// Init express
const app = express();

// Database + test
const db = require('./db');
const bodyParser = require('body-parser');
db.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log('Connected to database at: ' + res.rows[0]['now']);
  }
});

// Handlebars setup
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    helpers: helpers,
  })
);

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Static folder for css
app.use(express.static('public'));

// Endpoints/route handlers

app.get('/', (req, res) => {
  db.query('SELECT * FROM secretos ORDER BY id DESC LIMIT 10')
    .then((data) => res.render('index', { rows: data.rows }))
    .catch((e) => console.error(e.stack));
});

app.post('/add', (req, res) => {
  let { author, gender, age, content } = req.body;

  if (gender === 'Masculino') {
    gender = 'H';
  } else if (gender === 'Femenino') {
    gender = 'M';
  } else {
    gender = 'N';
  }

  const text =
    "INSERT INTO secretos (content, date, time, author, gender, age) VALUES($1, 'now', 'now', $2, $3, $4)";
  const values = [content, author, gender, age];

  db.query(text, values)
    .then((r) => {
      console.log('Success at inserting.');
      res.redirect('/');
    })
    .catch((e) => console.error(e.stack));
});

// app.use('/secretos', require('./routes/posts'));

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));
