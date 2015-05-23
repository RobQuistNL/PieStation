(function() {
    module.exports.runtime = "1 * * * * *"; //Every minute
    module.exports.name = "Morning alarm";
    module.exports.description = "Turn on TV and lights, then navigate to the news channel and set the volume to 20.";

    module.exports.event = function() {
        console.log('Enable TV and lights stuff');
    }
}());