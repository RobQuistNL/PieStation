(function() {
    module.exports.devices = {};

    module.exports.exec = require('child_process').exec;

    /**
     * Generates function to get devices' buttons from irsend command
     * @param  {String} deviceName name of device
     * @return {Function}            exec callback
     */
    module.exports.getCommandsForDevice = function(deviceName) {
        /**
         * Get Device's Button from irsend command
         * @param  {String} error  Error from running command
         * @param  {String} stdout std out
         * @param  {String} stderr std err
         * @return {None}
         */
        return function(error, stdout, stderr) {
            var lines = stderr.split("\n");
            for(var lineIndex in lines) {
                var line = lines[lineIndex];
                var parts = line.split(" ");
                if(parts.length>2) {
                    var keyName = parts[2];
                    module.exports.devices[deviceName].push(keyName);
                    console.log(deviceName + " found key: "+keyName);
                }
            }
        }
    }

    /**
     * Get Device from irsend command
     * @param  {String} error  Error from running command
     * @param  {String} stdout std out
     * @param  {String} stderr std err
     * @return {None}
     */
    module.exports.getDevice = function (error, stdout, stderr) {
        if(error) {
            console.log("irsend (LIRC) not available - skipping IR support.");
            return;
        }
        var lines = stderr.split("\n");
        for(var lineIndex in lines) {
            var line = lines[lineIndex];
            var parts = line.split(" ");
            if(parts.length>1) {
                var deviceName = parts[1];
                console.log("device found: "+deviceName.trim());
                module.exports.devices[deviceName] = [];
                module.exports.exec("irsend list \""+deviceName+"\" \"\"", module.exports.getCommandsForDevice(deviceName));

            }
        }
    };

    module.exports.initialize = function() {

        module.exports.exec("irsend list \"\" \"\"", module.exports.getDevice);
    };

}());
