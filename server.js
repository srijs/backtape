#!/usr/bin/env node

var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {log: false});

app.configure(function () {
  app.use(express.bodyParser());
  app.use('/', express.static(__dirname));
});

app.post('/diff', function (req, res) {

  fs.readdir('.', function (err, files) {
    var rDocs = req.body;
    if (err) {
      res.send(500);
    } else {
      files.forEach(function (file) {
        var id = file.split('.')[0];
        if (typeof rDocs[id] !== 'undefined') {
          delete rDocs[id];
        }
      });
      res.json(rDocs);
    }
  });

});

io.sockets.on('connection', function (socket) {
  socket.on('sync', function (data) {
    var doc = data.doc, token = data.token;
    https.get('https://api.doctape.com/v1/doc/' + doc.id + '/original?access_token=' + token, function (r) {
      var w = fs.createWriteStream('./.' + doc.id + '.' + doc.extension);
      if (r.statusCode === 200) {
        r.pipe(w, {end: false});
        r.on('end', function () {
          w.end();
          fs.rename('./.' + doc.id + '.' + doc.extension, './' + doc.id + '.' + doc.extension, function (err) {
            if (err) {
              socket.emit('fail', doc);
            } else {
              socket.emit('done', doc);
            }
          });
        });
      } else {
        socket.emit('fail', doc);
      }
    });
  });
});

server.listen(5432);
console.log('Direct your browser towards http://localhost:5432 and let backtape do it\'s magic...');
