var fs = require('fs');
var airport = require('lib/airport');
var iwlist = require('lib/iwlist');

function scan(callback) {
    fs.exists(airport.utility, function (exists) {
        if (exists) {
            airport.scan(callback);
        } else {
            fs.exists(iwlist.utility, function (exists) {
                if (exists) {
                    iwlist.scan(callback);
                } else {
                    callback("No scanning utility found", null);
                }
            });
        }
    });
}

exports.scan = scan;
