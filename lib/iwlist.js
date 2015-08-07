var exec = require('child_process').exec;
var util = require('util');
var linuxProvider = '/sbin/iwlist';
var linuxProvider_ssid = '/sbin/iwgetid';

function parseIwlist(str) {
    var out = str.replace(/^\s+/mg, '');
    out = out.split('\n');
    var cells = [];
    var line;
    var info = {};
    var fields = {
        'mac' : /^Cell \d+ - Address: (.*)/,
        'ssid' : /^ESSID:"(.*)"/,
        'channel': /^Channel:(.*)/,
        // 'protocol' : /^Protocol:(.*)/,
        // 'mode' : /^Mode:(.*)/,
        // 'frequency' : /^Frequency:(.*)/,
        // 'encryption_key' : /Encryption key:(.*)/,
        // 'bitrates' : /Bit Rates:(.*)/,
        // 'quality' : /Quality(?:=|\:)([^\s]+)/,
        'signal_level' : /Signal level(?:=|\:)([-\w]+)/
    };

    for (var i=0,l=out.length; i<l; i++) {
        line = out[i].trim();

        if (!line.length) {
            continue;
        }
        if (line.match("Scan completed :")) {
            continue;
        }
        if (line.match("Interface doesn't support scanning.")) {
            continue;
        }

        if (line.match(fields.mac)) {
            cells.push(info);
            info = {};
        }

        for (var field in fields) {
            if (line.match(fields[field])) {
                info[field] = (fields[field].exec(line)[1]).trim();
            }
        }
    }
    cells.push(info);
    cells.shift();
    return cells;
}

function scan(callback) {
    var new_env = util._extend(process.env, { LANG: "en" });
    exec(linuxProvider + ' scan', new_env, function (err, stdout, stderr) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, parseIwlist(stdout));
    });
}

function current(callback) {
    exec(linuxProvider_ssid+" -r", function(err, stdout, stderr){
        callback(null, {SSID:stdout});
    });
}

exports.scan = scan;
exports.current = current;
exports.utility = linuxProvider;
exports.utility_ssid = linuxProvider_ssid;
