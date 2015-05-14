var fs = require('fs');
var airport = require('./airport');
var iwlist = require('./iwlist');
var netsh = require('./netsh');

function scan(callback) {
    fs.exists(airport.utility, function (exists) {
        if (exists) {
            airport.scan(callback);
            return;
        }

        fs.exists(iwlist.utility, function (exists) {
            if (exists) {
                iwlist.scan(callback);
                return;
            }

            fs.exists(netsh.utility, function (exists) {
                if (exists) {
                    netsh.scan(callback);
                    return;
                }

                callback(new Error("No scanning utility found"), null);
            });
        });
    });
}

exports.scan = scan;
