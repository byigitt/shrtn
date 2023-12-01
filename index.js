require('dotenv').config();

const 
  mongoose = require('mongoose'),
  express = require('express'),
  app = express();

app
  .set('trust proxy', true)
  .set('view engine', 'ejs');

app
  .use(express.urlencoded({ extended: false }))
  .use(express.json());

app
  .use('/', require('./routers/index'))

app
  .listen(8080, async () => {
    try {
      await mongoose.connect('mongodb://localhost/shortener');
      console.log('http://localhost:8080');
    } catch (e) {
      throw new Error(e);
    };
  });