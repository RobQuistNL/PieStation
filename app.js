//Listening port
var port = 80;

var lirc = require("./modules/lirc.js");
var exec = require('child_process').exec;
var alarms = require("./modules/alarms.js").initialize();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastLedKey = "unknown";

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

    console.log('Got KAKU: ' + letter + ' ' + code + ' ' + onoff);
    var command="sudo /var/wiringPi/examples/lights/kaku " + letter + " " + code + " " + onoff;

    exec(command, function(error, stdout, stderr){
        if(error) {
            res.send("Error sending command ("+error+stdout+stderr+")");
        } else {
            res.send("Sent command!" + stdout + stderr);
        }
    });
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
        if(error) {
            res.send("Error sending command");
        } else {
            res.send("Dun send");
        }
    });
}

app.get('/get/devices', function(req, res) {
    return res.send(lirc.devices);
});

lirc.initialize();

http.listen(port, function(){
    console.log('listening on *:'+port);
});

process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE') {
        console.log('Listening address on port ' + port + ' is in use or unavailable.');
        process.exit(1);
    } else {
        throw err;
    }
});