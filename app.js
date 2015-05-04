//Listening port
var port = 80;

var lirc = require("./modules/lirc.js");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
    var letter = req.param("letter");
    var code = req.param("code");
    var onoff = req.param("onoff");
    console.log('Got ' + letter + ' ' + code + ' ' + onoff);
    var command="sudo /home/pi/wiringPi/examples/lights/kaku " + letter + " " + code + " " + onoff;

    lirc.exec(command, function(error, stdout, stderr){
        if(error) {
            res.send("Error sending command ("+error+stdout+stderr+")");
        } else {
            res.send("Dun send" + stdout + stderr);
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

    // send command to irsend
    var command = "irsend SEND_ONCE "+deviceName+" "+key;
    lirc.exec(command, function(error, stdout, stderr){
        if(error) {
            res.send("Error sending command");
        } else {
            res.send("Dun send");
        }
    }); 
});

app.get('/get/devices', function(req, res) {
    return res.send(lirc.devices);
});

lirc.initialize();

http.listen(port, function(){
    console.log('listening on *:'+port);
});
