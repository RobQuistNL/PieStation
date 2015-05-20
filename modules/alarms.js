(function() {
    module.exports.alarmclock = null;

    //Array that contains all events
    module.exports.events = [];

    module.exports.initialize = function() {
        var path = require('path');
        var fs = require('fs');
        var cronJob = require('cron').CronJob;
        var exec = require('child_process').exec;

        var eventDir = path.dirname(require.main.filename) + '' + path.sep + 'events' + path.sep;

        console.log('Loading all timed events in folder: ' + eventDir);
        fs.readdir(eventDir, function(err, files) {
            if (err) {console.log(err); return;}
            files.forEach(function(filename) {
                console.log(' - Found timed event: ' + filename);
                var includedEvent = require(eventDir + filename);
                console.log(' - - Running times: ' + includedEvent.runtime);

                var runningJob = new cronJob(includedEvent.runtime, function() {
                    includedEvent.event();
                }, null, true);

                module.exports.events.push({"file": filename, "includedEvent": includedEvent});
            });
        });
    };
}());