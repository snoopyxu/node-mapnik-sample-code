#!/usr/bin/env node

// This example shows how to use node-mapnik with the
// basic node http server
//
// expected output: http://goo.gl/cyGwo

var mapnik = require('mapnik');
var http = require('http');
var path = require('path');

var port = 8000;
var stylesheet = path.join(__dirname, '../stylesheet.xml');
// register shapefile plugin
if (mapnik.register_default_input_plugins) mapnik.register_default_input_plugins();

http.createServer(function(req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  var map = new mapnik.Map(256, 256);
  map.load(stylesheet, function(err,map) {
      if (err) {
          return res.end(err.message);
      }
      map.zoomAll();
      var im = new mapnik.Image(256, 256);
      map.render(im, function(err,im) {
        if (err) {
            res.end(err.message);
        } else {
            im.encode('png', function(err,buffer) {
                if (err) {
                    res.end(err.message);
                } else {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                    res.end(buffer);
                }
            });
        }
      });
   }
  );
}).listen(port);

console.log('server running on port ' + port);
