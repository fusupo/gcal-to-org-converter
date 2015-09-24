"use strict";

var fs = require('fs');
var ical = require('ical');
var icalendar = require('icalendar');
var request = require('request');
var moment = require('moment');
var secret = require('./secret.js');

function orgTimeStamp(start, end) {
    var res = '';
    if (end) {
      res += '<' + moment(start).format('YYYY-MM-DD ddd HH:mm');
      res += '-' + moment(end).format('HH:mm') + '>';
    } else {
      res += '<' + moment(start).format('YYYY-MM-DD ddd') + '>';
    }
    return res;
  }

request(secret[0].src, function(error, response, body) {
  if (error) throw (error);

  var res = '';
  var ical = icalendar.parse_calendar(body);

  ical.events().forEach(function(item) {
    var props = item.properties;
    var summary = props['SUMMARY'];
    var orgTitle = '* ' + summary[0].value + '\n';
    var rrule = props['RRULE'];
    var dtstart = props['DTSTART'][0].value;
    var dtend = props['DTEND'][0].value;
    var recurrence_id = props['RECURRENCE-ID'];
    if (rrule) {
      rrule = rrule[0].value;

      var freq = rrule['FREQ'].toLowerCase().slice(0, -2) + 's';
      var byday = rrule['BYDAY'].split(',');

      res += orgTitle;

      console.log(freq, byday);

      var smoment = moment(dtstart);
      var emoment = moment(dtend);

      var workingDate;
      switch (freq) {
        case 'months':
          workingDate = moment(smoment).date(1);
          break;
        case 'weeks':
          workingDate = moment(smoment).day('sunday');
          break;
      }

      console.log(smoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      console.log(workingDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      // console.log(rrule);

      var aMonthFromNow = moment().add(1, 'months');
      // // console.log(aMonthFromNow.format("dddd, MMMM Do YYYY, h:mm:ss a"));
      while (workingDate.isBefore(aMonthFromNow)) {

        switch (freq) {
          case 'months':
                
            break;
          case 'weeks':
            var tm = moment(workingDate);
            for(var i=0; i<byday.length; i++){
              var day = byday[i];
              switch(day){
                case 'MO':
                  tm.day('monday');
                  break;
                case 'TU':
                  tm.day('tuesday');
                  break;
                case 'WE':
                  tm.day('wednesday');
                  break;
                case 'TH':
                  tm.day('thursday');
                  break;
                case 'FR':
                  tm.day('friday');
                  break;
                case 'SA':
                  tm.day('saturday');
                  break;
                case 'SU':
                  tm.day('sunday');
                  break;
              }
              console.log('### ' + tm.format("dddd, MMMM Do YYYY, h:mm:ss a"));
            }
            // switch(){

            // }
            break;
        }
        
        workingDate.add(1, freq);
        console.log(' -- > ' + workingDate.format('dddd, MMMM Do YYYY, h:mm:ss a'));
      }

      // if (dtstart.date_only) {
      //   res += '  ' + orgTimeStamp(dtstart) + '\n';
      // } else {
      //   res += '  ' + orgTimeStamp(dtstart, dtend) + '\n';
      // }
    } else {
      if (recurrence_id === undefined) {
        res += orgTitle;
        if (dtstart.date_only) {
          res += '  ALL DAY\n';
        } else {
          res += '  ' + orgTimeStamp(dtstart, dtend) + '\n';
          // res += '  NOT ALL DAY\n';
        }
      } else {
        //res += orgTitle + '  this is recurring\n';
      }
    }
  });
  saveOrgFile(res);
});
// };

var saveOrgFile = function(dataStr) {
  fs.writeFile('doodle.org' /*resource.targ*/ , dataStr, function() {
    // console.log('mutherfucking complete : ', secret.length);
    // if (secret.length > 0) {
    //   resource = secret.pop();
    //   getXML(resource.src);
    // }
  });
};

// {
//   DTSTART: [{
//     type: 'DATE-TIME',
//     name: 'DTSTART',
//     value: Fri Jul 03 2015 12: 30: 00 GMT - 0700(PDT),
//     parameters: [Object]
//   }],
//   DTEND: [{
//     type: 'DATE-TIME',
//     name: 'DTEND',
//     value: Fri Jul 03 2015 13: 30: 00 GMT - 0700(PDT),
//     parameters: [Object]
//   }],
//   RRULE: [{
//     type: 'RECUR',
//     name: 'RRULE',
//     value: [Object],
//     parameters: {}
//   }],
//   EXDATE: [{
//     type: 'DATE-TIME',
//     name: 'EXDATE',
//     value: [Object],
//     parameters: [Object]
//   }],
//   DTSTAMP: [{
//     type: 'DATE-TIME',
//     name: 'DTSTAMP',
//     value: Wed Sep 23 2015 13: 39: 31 GMT - 0700(PDT),
//     parameters: {}
//   }],
//   ORGANIZER: [{
//     type: 'CAL-ADDRESS',
//     name: 'ORGANIZER',
//     value: 'mailto:bianca@telegraphacademy.com',
//     parameters: [Object]
//   }],
//   UID: [{
//     type: 'TEXT',
//     name: 'UID',
//     value: '6k0rkac8egtrb0u61n1c8hp5hc@google.com',
//     parameters: {}
//   }],
//   ATTENDEE: [{
//     type: 'CAL-ADDRESS',
//     name: 'ATTENDEE',
//     value: 'mailto:shanti@telegraphacademy.com',
//     parameters: [Object]
//   }, {
//     type: 'CAL-ADDRESS',
//     name: 'ATTENDEE',
//     value: 'mailto:openarms@telegraphacademy.com',
//     parameters: [Object]
//   }, {
//     type: 'CAL-ADDRESS',
//     name: 'ATTENDEE',
//     value: 'mailto:bianca@telegraphacademy.com',
//     parameters: [Object]
//   }, {
//     type: 'CAL-ADDRESS',
//     name: 'ATTENDEE',
//     value: 'mailto:marc.christophe@telegraphacademy.com',
//     parameters: [Object]
//   }],
//   CREATED: [{
//     type: 'DATE-TIME',
//     name: 'CREATED',
//     value: Wed Jul 01 2015 15: 59: 51 GMT - 0700(PDT),
//     parameters: {}
//   }],
//   DESCRIPTION: [{
//     type: 'TEXT',
//     name: 'DESCRIPTION',
//     value: '',
//     parameters: {}
//   }],
//   'LAST-MODIFIED': [{
//     type: 'DATE-TIME',
//     name: 'LAST-MODIFIED',
//     value: Thu Sep 17 2015 21: 43: 56 GMT - 0700(PDT),
//     parameters: {}
//   }],
//   LOCATION: [{
//     type: 'TEXT',
//     name: 'LOCATION',
//     value: '',
//     parameters: {}
//   }],
//   SEQUENCE: [{
//     type: 'INTEGER',
//     name: 'SEQUENCE',
//     value: '0',
//     parameters: {}
//   }],
//   STATUS: [{
//     type: 'TEXT',
//     name: 'STATUS',
//     value: 'CONFIRMED',
//     parameters: {}
//   }],
//   SUMMARY: [{
//     type: 'TEXT',
//     name: 'SUMMARY',
//     value: 'All Hands Meeting',
//     parameters: {}
//   }],
//   TRANSP: [{
//     type: 'TEXT',
//     name: 'TRANSP',
//     value: 'OPAQUE',
//     parameters: {}
//   }]
// };
