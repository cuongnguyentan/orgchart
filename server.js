require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT;

const options = {
  setHeaders(res, route) {
    if (route.indexOf('index.html') < 0) {
      res.set('Cache-Control', 'public, max-age=604800');
      res.set('Expires', new Date(Date.now() + 604800000).toUTCString());
    } else {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
  }
};

app.use(express.static(path.join(__dirname, 'build'), options));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

app.listen(port);
console.log('Live!', port); // eslint-disable-line no-console
