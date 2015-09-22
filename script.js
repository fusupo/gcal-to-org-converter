"use strict";

var fs = require('fs');
var request = require('request');
var parseString = require('xml2js').parseString;
var secret = require('./secret.js');
var moment = require('moment');

function getXML(src) {
  request(src, function(error, response, body) {
    if (error) throw (error);
    console.log(body);
  });
}

getXML(secret[0].src);

//   if (!error && response.statusCode == 200) {
//     parseString(body, function(err, result) {
//       var entries = result.feed.entry;

//       var res = '';

//       entries.forEach(function(evt) {
//         var evtSummary = evt.summary[0]['_'].replace(/(\r\n|\n|\r)/gm, "").replace("&nbsp", " ").replace(/<br>/g, "<br>") + "<br>\n";
//         // check for 'Recurring Event' Status
//         var recurring = evtSummary.match(/Recurring Event([\s\S]*?<br>)/g);
//         if (recurring === null) {
//           var orgTitle = "* " + evt.title[0]['_'] + "\n";
//           var evtDateCapture = evtSummary.match(/When:([\s\S]*?<br>)/g);
//           var evtDateStr = evtDateCapture[0].substr(5).slice(0, -4);
//           // var evtTimeZone = evtDateStr.slice(-4);
//           // console.log(evtTimeZone);
//           var evtDateStartCature = evtDateStr.match(/([\s\S]*?(to))/g);
//           var evtDateStartStr = evtDateStartCature[0].slice(0, -3).substr(1);
//           var evtDateEndCapture = evtDateStr.match(/to([\s\S]*)/g);
//           var evtDateTimeZone = evtDateEndCapture[0].slice(-3);
//           var evtDateEndStr = evtDateEndCapture[0].substr(3).slice(0,-5);
//           var m = moment(evtDateEndStr, 'h:mm a');
//           // Thu Sep 17, 2015 10am
//           var evtMoment = moment(evtDateStartStr, 'ddd MMM D, YYYY h:mm a');
//           // console.log(evtDateStartStr + ' -- > ' + evtMoment.format() + ' -- > ' + evtMoment.format('<YYYY-MM-DD ddd HH:mm->'));
//           var org_active_timestamp = evtMoment.format('<YYYY-MM-DD ddd HH:mm-');
//           org_active_timestamp += m.format('HH:mm>') + '\n';
//           console.log(org_active_timestamp);
//           res += orgTitle;
//           res += '  ' + org_active_timestamp;
//         } else {
//           //this is a recurring event...deal with it
//         }

//         // retrieve and save title
//         // var evtStr = 
//         // orgEntry += evtStr;
//         //console.log(evt.title[0]['_'], orgEntry.match(/When:([\s\S]*?<br>)/g), orgEntry.match(/Status:([\s\S]*?<br>)/g));
//         // console.log(orgEntry.match(/Recurring Event([\s\S]*?<br>)/g));

//       });

//       // fs.writeFile('doodle.org', res);
//       fs.writeFile('', res);

//     });
//   }

console.log(secret);
