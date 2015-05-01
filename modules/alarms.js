(function() {
    module.exports.alarmclock = null;

    module.exports.exec = require('child_process').exec;
    module.exports.cronJob = require('cron').CronJob;

    module.exports.checkAlarms = function() {
        console.log('Alarm happened!');
    };

    module.exports.initialize = function() {
        console.log('Setting up cron every minute to poll for alarm clocks');
        alarmclock = new module.exports.cronJob('1 * * * * *', function() {
            module.exports.checkAlarms();
        }, null, true);
    };

}());