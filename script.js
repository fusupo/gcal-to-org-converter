var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;
var secret = require('./secret.js');

request(secret.xmlEndpoint, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    parseString(body, function(err, result) {
      var entries = result.feed.entry;

      var res = '';

      entries.forEach(function(evt) {
        var evtSummary = evt.summary[0]['_'].replace(/(\r\n|\n|\r)/gm, "").replace("&nbsp", " ").replace(/<br>/g, "<br>") + "<br>\n";
        // check for 'Recurring Event' Status
        var recurring = evtSummary.match(/Recurring Event([\s\S]*?<br>)/g);
        if (recurring === null) {
          var orgTitle = "* " + evt.title[0]['_'] + "\n";
          var evtDateCapture = evtSummary.match(/When:([\s\S]*?<br>)/g);
          var evtDateStr = evtDateCapture[0].substr(5).slice(0, -4);
          var evtDateStartCature = evtDateStr.match(/([\s\S]*?(to))/g);
          var evtDateStartStr = evtDateStartCature[0].slice(0, -3);
          console.log(evtDateStartStr);
          res += orgTitle;
        } else {
          //this is a recurring event...deal with it
        }

        // retrieve and save title
        // var evtStr = 
        // orgEntry += evtStr;
        //console.log(evt.title[0]['_'], orgEntry.match(/When:([\s\S]*?<br>)/g), orgEntry.match(/Status:([\s\S]*?<br>)/g));
        // console.log(orgEntry.match(/Recurring Event([\s\S]*?<br>)/g));

      });

      fs.writeFile('doodle.org', res);
    });
  }
});
