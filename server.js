#!/usr/bin/env node

var fs = require('fs'),
    https = require('https'),
    express = require('express');

var app = express();

app.configure(function () {
  app.use(express.bodyParser());
  app.use('/', express.static(__dirname));
});

app.post('/diff', function (req, res) {

  try { fs.mkdirSync('./Backtape'); } catch (e) {;}

  fs.readdir('./Backtape', function (err, files) {
    var rDocs = req.body;
    if (err) {
      res.send(500);
    } else {
      files.forEach(function (file) {
        if (typeof rDocs[file] !== 'undefined') {
          delete rDocs[file];
        }
      });
      res.json(rDocs);
    }
  });

});

app.post('/sync', function (req, res) {

  var token = req.param('token'),
      docs = req.body,
      keys = Object.keys(docs);

  !function sync () {
    if (keys.length > 0) {
      var key = keys.shift();
      https.get('https://api.doctape.com/v1/doc/' + key + '/original?access_token=' + token, function (r) {
        var w = fs.createWriteStream('./Backtape/.' + key, {encoding: 'utf8'});
        if (r.statusCode === 200) {
          r.pipe(w, {end: false});
          r.on('end', function () {
            w.end();
            fs.rename('./Backtape/.' + key, './Backtape/' + key, function (err) {
              if (err) {
                res.send(500);
              } else {
                sync();
              }
            });
          });
        } else {
          res.send(500);
        }
      });
    } else {
      res.send(200);
    }
  }();

});

app.listen(5432);
console.log('Direct your browser towards http://localhost:5432 and let backtape do it\'s magic...');
