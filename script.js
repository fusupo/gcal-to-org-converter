var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;
var secret = require('./secret.js');

request(secret.xmlEndpoint, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parseString(body, function (err, result) {
      //fs.writeFile('doodle.json', JSON.stringify(result.feed.entry));
      fs.writeFile('doodle.json', JSON.stringify(result));
    });
  }
});
