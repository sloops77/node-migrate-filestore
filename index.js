/**
 * Created by arolave on 26/07/2016.
 */
var fs = require('fs');
var readline = require('readline');
var join = require('path').join;

module.exports = FileStore;

function FileStore(options) {
    this.path = options.stateFile || join('migrations', '.migrate');
}

FileStore.cliHandler = {
    usageOptions: ['     --state-file <path>     set path to state file (migrations/.migrate)'],
    parseArg    : function (arg) {
        switch (arg) {
            case '--state-file':
                return 'stateFile';
        }
    }
};

FileStore.prototype.load = function (callback) {
    var stream = fs.createReadStream(this.path, {encoding: 'utf8'});
    var lineReader = readline.createInterface({
        input: stream
    });

    var arr = [];

    lineReader.on('line', function (line) {
        console.log(line);
        try {
            arr.push(JSON.parse(line));
        } catch(err) {
            callback(err);
        }

    });

    lineReader.on('close', function (err) {
        callback(err, arr);
    });

    stream.on('error', function (err) {
        callback(err);
    });
};

FileStore.prototype.save = function (migration, callback) {
    fs.appendFile(this.path, JSON.stringify(migration) + '\n', 'utf8', callback);
};

FileStore.prototype.reset = function (callback) {
    fs.unlink(this.path, callback)
};