const path = require("path");
const express = require('express');
const morgan = require('morgan')
const handlebars = require('express-handlebars');

const port = 3000;

const app = express();

// HTTP request logger
app.use(morgan('combined'));

// Template engine
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  partialsDir: path.join(__dirname, '/resources/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

// Render
app.get('/', (req, res) => {
  res.render('home', {
    layout: false
  })
});

app.get('/news', (req, res) => {
  res.render('news')
});

app.get('/contact', (req, res) => {
  res.render('contact')
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
});