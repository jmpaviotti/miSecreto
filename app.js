const express = require('express');
const handlebars = require('express-handlebars');

// Init express
const app = express();

// Handlebars setup
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
  })
);

// Static public folder for css
app.use(express.static('public'));

// Create your endpoints/route handlers
app.get('/', (req, res) => {
  res.render('main', { layout: 'index' });
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));
