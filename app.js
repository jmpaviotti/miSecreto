const express = require('express');
const handlebars = require('express-handlebars');

// Init express
const app = express();

// Database + test
const db = require('./db');
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
  })
);

// Static folder for css
app.use(express.static('public'));

// Create your endpoints/route handlers
app.get('/', (req, res) => {
  res.render('index');
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));
