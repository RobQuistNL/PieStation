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
function textToSpeecha(text) {
    console.log('Speak: ' + text);
}

function textToSpeech(text, lang) {
    if (lang == undefined) {
        lang = 'en';
    }
    text = encodeURIComponent(text);

    var filename = 'file';
    var playcmd = 'omxplayer'; //ffplay -i
    var playArgs = ''; //' -v quiet -nodisp -autoexit';
    fs.exists('./speech/'+filename+'.mp3', function (exists) {
        if (exists) {
            console.log(playcmd+" ./speech/"+filename+".mp3" + playArgs);
        } else {
            console.log("curl 'http://translate.google.com/translate_tts?&ie=UTF-8&q="+text+"&tl="+lang+"&client=t' -H " +
                "'Referer: http://translate.google.com/' -H 'User-Agent: stagefright/1.2 (Linux;Android 5.0)' " +
                "> ./speech/"+filename+".mp3; "+playcmd+" ./speech/"+filename+".mp3" + playArgs);
        }
    });
}

eval(fs.readFileSync('./dist/voicecommands.js')+'');

//var body = fs.readFileSync('./mockresponses/weather-tonight.json');
//var body = fs.readFileSync('./mockresponses/rain-amsterdam-today.json');
//var body = fs.readFileSync('./mockresponses/rain-amsterdam-tomorrow.json');
//var body = fs.readFileSync('./mockresponses/will-it-rain-this-saturday.json');
//var body = fs.readFileSync('./mockresponses/will-it-rain.json');
var body = fs.readFileSync('./mockresponses/whats-the-weather-like.json');

parseSpeech(JSON.parse(body));