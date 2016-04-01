//Requires
var lirc = require("./modules/lirc.js");
var sonybravia = require("./modules/sonybravia.js");
var exec = require('child_process').exec;
var alarms = require("./modules/alarms.js").initialize();
var express = require('express');
var app = express();
var fs = require('fs');
var moment = require('moment');
var lpcm16 = require('node-record-lpcm16');
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;
var isRecording = false;
//var voicecommands = require('./dist/voicecommands.js')
eval(fs.readFileSync('./dist/voicecommands.js')+'');
var request = require('request');

//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

var http = require('http').Server(app);
//var https = require('https').createServer(credentials, app);

var io = require('socket.io')(http);
var lastLedKey = "unknown";
var _ = require('underscore');
var md5 = require('md5');
spawn = require('child_process').spawn;
var tv_volume = 20;
var isPi = false;

//Config
WEBSERVER_PORT = 80; //Listening port
TTS_VOICE = 'Graham';
TTS_LANG = 9;
/*
UK: 9 -> Rachel
Graham
Lucy

US:
 Sharon
 Ella (genuine child voice)
 EmilioEnglish (genuine child voice)
 Josh (genuine child voice)
 Karen
 Kenny (artificial child voice)
 Laura
 Micah <- Good male
 Nelly (artificial child voice)
 Rod
 Ryan
 Saul
 Scott (genuine teenager voice)
 Tracy <- Ok
 ValeriaEnglish (genuine child voice)
 Will
 WillBadGuy (emotive voice) <- Cool
 WillFromAfar (emotive voice)
 WillHappy (emotive voice) <- Ok
 WillLittleCreature (emotive voice)
 WillOldMan (emotive voice)
 WillSad (emotive voice)
 WillUpClose (emotive voice) <- Whispering, lol
 */
exec('export AUDIODEV=hw:1,0; export AUDIODRIVER=alsa;');
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    //console.log('a user connected');

    socket.on('disconnect', function(){
        //console.log('user disconnected');
    });

    //Emit all local events through (ofcourse identification of devices is still todo)
    socket.on('localevent', function(data){
        io.emit('localevent', data);
    });

    socket.on('restart', function(data) {
        process.exit(0);
    });
});

app.get('/send/kaku/:letter/:code/:onoff', function(req, res) {
    // KlikAanKlikUit remote power thingies
    var letter = req.params.letter;
    var code = req.params.code;
    var onoff = req.params.onoff;
    KaKu (letter, code, onoff, res);
});

app.get('/433/:string', function(req, res) {
    // KlikAanKlikUit remote power thingies
    var string = req.params.string;
    do433 (string, res);
});


app.get('/tv/:ircc', function(req, res) {
    var ircc = req.param.ircc;
    sonybravia.sendIRCC(ircc);
});

app.get('/tvvolume/:volume', function(req, res) {
    var volume = req.param("volume");
    sonybravia.setVolume(volume);
});


function textToSpeech(text, lang) {
    if (lang == undefined) {
        lang = 'en';
    }
    text = encodeURIComponent(text);
    console.log('SPEAK: ' + text);
    text = text + ". ."

    var filename = md5(text);
    var playcmd = 'omxplayer'; //ffplay -i
    var playArgs = ''; //' -v quiet -nodisp -autoexit';
    fs.exists('./speech/'+filename+'.mp3', function (exists) {
        if (exists) {
            sonybravia.setVolume(0);
            exec(playcmd+" ./speech/"+filename+".mp3" + playArgs);
            setTimeout(function(){sonybravia.setVolume(tv_volume);}, text.length*25);
        } else {
            /*exec("curl $(curl --data 'MyLanguages=sonid10&MySelectedVoice="+TTS_VOICE+"&MyTextForTTS=" + text +
                "&t=1&SendToVaaS=' 'http://www.acapela-group.com/demo-tts/DemoHTML5Form_V2.php' | grep -o" +
                " \"http.*mp3\")\"> ./speech/"+filename+".mp3; "+playcmd+" ./speech/"+filename+".mp3" + playArgs);
                */

            exec("curl $(curl --data 'MyLanguages=sonid"+ TTS_LANG +"&MySelectedVoice="+TTS_VOICE+"&MyTextForTTS=" + text + "&t=1&SendToVaaS=' 'http://www.acapela-group.com/demo-tts/DemoHTML5Form_V2.php' | grep -o \"http.*mp3\") > ./speech/"+filename+".mp3; "+playcmd+" ./speech/"+filename+".mp3" + playArgs);

            sonybravia.setVolume(0);
            setTimeout(function(){sonybravia.setVolume(tv_volume);}, text.length*50);
        }
    });
}



function playSound(file) {
    var playcmd = 'omxplayer'; //ffplay -i
    var playArgs = ''; //' -v quiet -nodisp -autoexit';
    exec(playcmd + " " + file + playArgs);
}

function do433(string, res) {
    console.log('Got 433: ' + string);
    var command="sudo /var/piestation/dist/433/jeroen/433rgb " + string;

    exec(command, function(error, stdout, stderr){
        if(error) {
            var msg = 'ERROR:' + error;
        } else {
            var msg = "Sent command!" + stdout + stderr;
        }
        if (res != undefined) {
            res.send(msg);
        } else {
            console.log(msg);
        }
    });
}

function KaKu(letter, code, onoff, res) {
    console.log('Got KAKU: ' + letter + ' ' + code + ' ' + onoff);
    var command="sudo /var/wiringPi/examples/lights/kaku " + letter + " " + code + " " + onoff;

    exec(command, function(error, stdout, stderr){
        if(error) {
            var msg = 'ERROR:' + error;
        } else {
            var msg = "Sent command!" + stdout + stderr;
        }
        if (res != undefined) {
            res.send(msg);
        } else {
            console.log(msg);
        }
    });
}

app.get('/tts/:string/:lang', function(req, res) {
    textToSpeech(req.param("string"), req.param("lang"));
    return res.send('Speaking');
});

app.get('/send/:device/:key', function(req, res) {
    var deviceName = req.param("device");
    var key = req.param("key").toUpperCase();

    // Make sure that the user has requested a valid device
    if(!lirc.devices.hasOwnProperty(deviceName)) {
        res.send("Unknown device");
        return;
    }

    if (deviceName == 'ledstrip') {
        lastLedKey = key;
    }

    console.log('Got '+deviceName+ ' - ' + key);

    // Make sure that the user has requested a valid key/button
    var device = lirc.devices[deviceName];
    var deviceKeyFound = false;
    for(var i = 0; i < device.length; i++) {
        if(device[i] === key) {
            deviceKeyFound = true;
            break;
        }
    }
    if(!deviceKeyFound) {
        res.send("Invalid key number: "+key);
        return;
    }

    sendLirc(deviceName, key, res);
    if (deviceName != 'ledstrip') {
        console.log('Sending last led strip key:' + lastLedKey);
        lirc.exec("irsend SEND_ONCE ledstrip "+lastLedKey, function(error, stdout, stderr){});
    }
});

function sendLirc(deviceName, key, res) {
    // send command to irsend
    console.log('Send IR ' + deviceName + ' - ' + key);
    var command = "irsend SEND_ONCE "+deviceName+" "+key;
    lirc.exec(command, function(error, stdout, stderr){
        if (res != undefined) {
            if(error) {
                res.send("Error sending command");
            } else {
                res.send("Dun send");
            }
        }
    });
}

app.get('/get/devices', function(req, res) {
    return res.send(lirc.devices);
});

lirc.initialize();

http.listen(WEBSERVER_PORT, function(){
    console.log('listening on *:'+WEBSERVER_PORT);
});

/*https.listen(443, function(){
    console.log('listening on *:443');
});
*/
app.get('/start-listening', function(req, res) {
    listenToSpeech(res);
    return res.send('Listening!');
});

app.get('/stop-listening', function(req, res) {
    stopListening();
    return res.send('Stop listening!');
});
var responses = {
    notUnderstood: [
        "Sorry, I did not understand you.",
        "Lol, come again?",
        "Sorry, what was that?",
        "Sorry, I didn't understand a word of that.",
        "uh. Not sure what you ment. Can you repeat that?"
    ],
    dontKnowWhatToDo: [
        "Sorry, I do not know what to do with that. Spank Rob. It is his fault.",
        "Hmm. No idea what I should do.",
        "I eh. uhm. Mmm. I don't know what to do now. bye."
    ]
};

function stopListening() {
    if (isRecording == false) {
        return;
    }
    console.log('Stop recording');
    lpcm16.stop();
    isRecording = false;
    sonybravia.setVolume(tv_volume);
}

function listenToSpeech(res) {
    if (isRecording == true) {
        return;
    }
    console.log('Recording...');
    isRecording = true;
    sonybravia.setVolume(0);
    playSound('./dist/homer-hello.ogg');
    setTimeout(function() {

        lpcm16.start({
            verbose: false,
            recordProgram: 'arecord',
            cmdArgs: ['-D', 'plughw:1,0']
        }).pipe(request.post({
                'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
                'headers' : {
                    'Accept'        : 'application/vnd.wit.20160202+json',
                    'Authorization' : 'Bearer ' + voicecommands.witAiKey,
                    'Content-Type'  : 'audio/wav'
                }
            }, function(err,httpResponse,body) {
                isRecording = false;
                console.log(body);
                try {
                    parseSpeech(JSON.parse(body));
                } catch (exception) {
                    console.log(exception);
                }

            }));
        setTimeout(function () {
            stopListening();
        }, 5000);
    }, 1900);
}
console.log(voicecommands.commands);
function parseSpeech(res) {
    if (res.outcomes == undefined || res.outcomes.length == 0) {
        //textToSpeech('Lol. Sorry. I did not understand a word of that.');

        textToSpeech(responses.notUnderstood[Math.floor(Math.random() * responses.notUnderstood.length)]);
        console.log('No outcomes.');
        return;
    }
    _.each(res.outcomes, function(outcome) {
        if (outcome.confidence < .50) {
            //textToSpeech('You said ' + outcome._text + '. I am not sure what you ment.');
            textToSpeech(responses.notUnderstood[Math.floor(Math.random() * responses.notUnderstood.length)]);
            return;
        }

        var commandFunction = voicecommands.commands[outcome.intent.toLowerCase()];
        if (commandFunction != undefined && outcome.entities.length != 0) {
            commandFunction(outcome.entities);
        } else {
            //textToSpeech('Quite sure you said "' + outcome._text + '". But i have no commands assigned to that.');
            textToSpeech(responses.dontKnowWhatToDo[Math.floor(Math.random() * responses.dontKnowWhatToDo.length)]);
        }
    });

}

process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE') {
        console.log('Listening address on port ' + WEBSERVER_PORT + ' is in use or unavailable.');
        process.exit(1);
    } else {
        throw err;
    }
});

