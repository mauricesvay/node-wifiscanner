var exec = require('child_process').exec;
var macProvider = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';

function parseAirport(str) {
    var lines = str.split('\n');
    var colSsid = 0;
    var colMac = lines[0].indexOf('BSSID');
    var colRssi = lines[0].indexOf('RSSI');
    var colChannel = lines[0].indexOf('CHANNEL');
    var colHt = lines[0].indexOf('HT');
    var colCountry = lines[0].indexOf('CC');
    var colSec = lines[0].indexOf('SECURITY');

    var wifis = [];
    for (var i=1,l=lines.length; i<l; i++) {
        var encryption = 'off';
        if (lines[i].substr(colSec, lines[i].length).trim() !== 'NONE') {
            encrpytion = 'on';
        }
        wifis.push({
            'mac' : lines[i].substr(colMac, colRssi - colMac).trim(),
            'ssid' : lines[i].substr(0, colMac).trim(),
            'channel' : lines[i].substr(colChannel, colHt - colChannel).trim(),
            'encryption' : encryption,
            'signal_level' : lines[i].substr(colRssi, colChannel - colRssi).trim()
        });
    }
    wifis.pop();
    return wifis;
}

function scan(callback) {
    exec(macProvider + ' -s', function(err, stdout, stderr){
        if (err) {
            errClbk(err, null);
            return;
        }
        callback(null, parseAirport(stdout));
    });
}

exports.scan = scan;
exports.utility = macProvider;