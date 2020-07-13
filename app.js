const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const helpers = require('./lib/helpers');
const favicon = require('serve-favicon');

// Init express
const app = express();

// Session
app.use(
  session({
    secret: 'sopa de macaco, uma delicia mano',
    resave: false,
    saveUninitialized: false,
  })
);

// Favicon
app.use(favicon('./public/favicon.ico'));

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
    helpers: helpers,
  })
);

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static folder for css
app.use(express.static('public'));

// Endpoints/route handlers
const indexRouter = require('./routes/index');
const secretosRouter = require('./routes/secretos');
app.use('/', indexRouter);
app.use('/secretos', secretosRouter);

// Listen on a port
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
