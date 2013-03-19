var fs = require('fs');
var airport = require('./airport');
var iwlist = require('./iwlist');

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
