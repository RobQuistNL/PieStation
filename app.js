//Requires
var lirc = require("./modules/lirc.js");
var exec = require('child_process').exec;
var alarms = require("./modules/alarms.js").initialize();
var express = require('express');
var app = express();
var fs = require('fs');
var lpcm16 = require('node-record-lpcm16');

var request = require('request');

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var http = require('http').Server(app);
var https = require('https').createServer(credentials, app);

var io = require('socket.io')(http);
var lastLedKey = "unknown";
var _ = require('underscore');
var md5 = require('md5');
spawn = require('child_process').spawn;

var isPi = false;

//Config
WEBSERVER_PORT = 80; //Listening port
WIT_ACCESS_TOKEN = '2OSPY3KNG5JEHYFPSWXYV2Z4LV22FJ3O';
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
    var letter = req.param("letter");
    var code = req.param("code");
    var onoff = req.param("onoff");
    KaKu (letter, code, onoff, res);
});

function textToSpeech(text, lang) {
    if (lang == undefined) {
        lang = 'en';
    }
    text = encodeURIComponent(text);

    var filename = md5(text);
    var playcmd = 'omxplayer'; //ffplay -i
    var playArgs = ''; //' -v quiet -nodisp -autoexit';
    fs.exists('./speech/'+filename+'.mp3', function (exists) {
        if (exists) {
            exec(playcmd+" ./speech/"+filename+".mp3" + playArgs);
        } else {
            exec("curl 'http://translate.google.com/translate_tts?&ie=UTF-8&q="+text+"&tl="+lang+"&client=t' -H " +
                "'Referer: http://translate.google.com/' -H 'User-Agent: stagefright/1.2 (Linux;Android 5.0)' " +
                "> ./speech/"+filename+".mp3; "+playcmd+" ./speech/"+filename+".mp3" + playArgs);
        }
    });
}

function playSound(file) {
    var playcmd = 'omxplayer'; //ffplay -i
    var playArgs = ''; //' -v quiet -nodisp -autoexit';
    exec(playcmd+" ./speech/"+file+".mp3" + playArgs);
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

https.listen(443, function(){
    console.log('listening on *:443');
});

app.get('/start-listening', function(req, res) {
    listenToSpeech(res);
    return res.send('Listening!');
});

function listenToSpeech(res) {
    console.log('Listening...');
    sendLirc('sonytv', 'KEY_MUTE');
    playSound('./dist/homer-hello.ogg');
    isRecording = true;
    lpcm16.start({
            verbose: true,
            recordProgram: 'arecord'
        }).pipe(request.post({
            'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
            'headers' : {
                'Accept'        : 'application/vnd.wit.20160202+json',
                'Authorization' : 'Bearer ' + WIT_ACCESS_TOKEN,
                'Content-Type'  : 'audio/wav'
            }
    }, function(err,httpResponse,body) {
        isRecording = false;
        parseSpeech(JSON.parse(body));
    }));
    setTimeout(function () {
        lpcm16.stop();
        sendLirc('sonytv', 'KEY_MUTE');
    }, 4000);
}

function parseSpeech(res) {
    if (res.outcomes[0] == undefined) {
        console.log('No outcomes.');
        return;
    }
    _.each(res.outcomes[0].entities, function(entity) {
        entity = entity[0];
        if (res.outcomes[0].confidence < .50) {
            return
        }
        console.log(res.outcomes[0].intent, entity._entity, entity.value, res.outcomes[0].confidence);
        switch (res.outcomes[0].intent) {
            case 'TV_Control':
                switch (entity._entity) {
                    case 'on_off':
                        switch (entity.value) {
                            case 'on':
                                KaKu('M', '20', 'on')
                                break;
                            case 'off':
                                KaKu('M', '20', 'off')
                                break;
                        }
                        break;
                }
                break;
            case 'Lights_control':
                switch (entity._entity) {
                    case 'on_off':
                        switch (entity.value) {
                            case 'on':
                                KaKu('M', '10', 'on')
                                break;
                            case 'off':
                                KaKu('M', '10', 'off')
                                break;
                        }
                        break;
                }
                break;
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

