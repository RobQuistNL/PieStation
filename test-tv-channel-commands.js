var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var moment = require('moment');

function parseSpeech(res) {
    if (res.outcomes == undefined || res.outcomes.length == 0) {
        textToSpeech('Lol. Sorry. I did not understand a word of that.');
        console.log('No outcomes.');
        return;
    }
    _.each(res.outcomes, function(outcome) {
        if (outcome.confidence < .50) {
            textToSpeech('You said ' + outcome._text + '. I am not sure what you ment.');
            return;
        }

        var commandFunction = voicecommands.commands[outcome.intent.toLowerCase()];
        if (commandFunction != undefined && outcome.entities.length != 0) {
            commandFunction(outcome.entities);
        } else {
            textToSpeech('Quite sure you said "' + outcome._text + '". But i have no commands assigned to that.');
        }
    });
}
function textToSpeech(text) {
    console.log('Speak: ' + text);
}


eval(fs.readFileSync('./dist/voicecommands.js')+'');

//var body = fs.readFileSync('./mockresponses/tvchannel/discoverychannel.json');
//var body = fs.readFileSync('./mockresponses/tvchannel/channel6.json');
//var body = fs.readFileSync('./mockresponses/tvchannel/computer.json');
var body = fs.readFileSync('./mockresponses/tvchannel/playstation.json');

var sonybravia = {};
sonybravia.sendIRCC = function(cmd) {
    console.log(cmd);
}

parseSpeech(JSON.parse(body));
