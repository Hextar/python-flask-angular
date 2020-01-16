// This server is useful you want to deploy the frontend to Heroku

// Install express server
const compression = require('compression');
const express = require('express');
const path = require('path');

const app = express();

app.use(compression());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/'));

app.get('/*', function (req, res, next) {
  if (req.url.indexOf("/assets/") === 0 || req.url.indexOf("/styles.") === 0) {
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  }
  next();
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the setDefault Heroku port
app.listen(process.env.PORT || 8080);
