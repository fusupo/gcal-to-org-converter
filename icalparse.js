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

function expandDay(day) {
  var result;
  switch (day) {
    case 'MO':
      result = 'monday';
      break;
    case 'TU':
      result = 'tuesday';
      break;
    case 'WE':
      result = 'wednesday';
      break;
    case 'TH':
      result = 'thursday';
      break;
    case 'FR':
      result = 'friday';
      break;
    case 'SA':
      result = 'saturday';
      break;
    case 'SU':
      result = 'sunday';
      break;
  }
  return result;
}

function enumerateDay(day) {
  var result;
  switch (day) {
    case 'MO':
      result = 1;
      break;
    case 'TU':
      result = 2;
      break;
    case 'WE':
      result = 3;
      break;
    case 'TH':
      result = 4;
      break;
    case 'FR':
      result = 5;
      break;
    case 'SA':
      result = 6;
      break;
    case 'SU':
      result = 0;
      break;
  }
  return result;
}

function parseRecrrentEvent(res, orgTitle, rrule, dtstart, dtend) {
  
  rrule = rrule[0].value;

  var freq = rrule['FREQ'].toLowerCase().slice(0, -2) + 's';
  var byday = rrule['BYDAY'].split(',');
  //  console.log(freq, byday);
  var smoment = moment(dtstart);
  var emoment = moment(dtend);

  var workingDateS;
  var workingDateE;
  
  switch (freq) {
    case 'months':
      workingDateS = moment(smoment).date(1);
      workingDateE = moment(emoment).date(1);
      break;
    case 'weeks':
      workingDateS = moment(smoment).day('sunday');
      workingDateE = moment(emoment).day('sunday');
      break;
  }

  // console.log('start: ', smoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log('working: ', workingDate.format("dddd, MMMM Do YYYY, h:mm:ss a"));

  var aMonthFromNow = moment().add(2, 'months');
  while (workingDateS.isBefore(aMonthFromNow)) {

    // console.log('b -- > ' + workingDate.format('dddd, MMMM Do YYYY, h:mm:ss a'));

    switch (freq) {
      case 'months':

        var tmS = moment(workingDateS);
        var tmE = moment(workingDateE);

        for (var i = 0; i < byday.length; i++) {

          var dayn = enumerateDay(byday[i].substr(-2));
          while (tmS.day() !== dayn) {
            tmS.add(1, 'day');
            tmE.add(1, 'day');
          }

          tmS.add(byday[i][0] - 1, 'weeks');
          tmE.add(byday[i][0] - 1, 'weeks');

          // console.log(byday[i][0]);
          // console.log(byday[i].substr(-2));
          // console.log('@@@ ' + tmS.format("dddd, MMMM Do YYYY, h:mm:ss a") + ' -- ' + tmE.format("dddd, MMMM Do YYYY, h:mm:ss a"));
          
          res += orgTitle;
          res += '  ' + orgTimeStamp(tmS, tmE) + '\n';
        }

        break;
      case 'weeks':

        var tmS = moment(workingDateS);
        var tmE = moment(workingDateE);
        
        for (var i = 0; i < byday.length; i++) {
          var day = expandDay(byday[i]);
          tmS.day(day);
          tmE.day(day);
            //console.log('### ' + tmS.format("dddd, MMMM Do YYYY, h:mm:ss a") + ' -- ' + tmE.format("dddd, MMMM Do YYYY, h:mm:ss a"));
          res += orgTitle;
          res += '  ' + orgTimeStamp(tmS, tmE) + '\n';
        }
        break;
    }

    workingDateS.add(1, freq);
    workingDateE.add(1, freq);
    // console.log('e -- > ' + workingDate.format('dddd, MMMM Do YYYY, h:mm:ss a'));
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

      res += parseRecrrentEvent(res, orgTitle, rrule, dtstart, dtend);

    } else {

      console.log(dtstart);
      if (recurrence_id === undefined) {
        res += orgTitle;
        if (dtstart.date_only) {
          res += '  ALL DAY\n';
        } else {
          res += '  ' + orgTimeStamp(dtstart, dtend) + '\n';
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
