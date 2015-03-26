//Listening port
var port = 80;

var sys = require('sys')
var express = require('express');
var app = express();
var lirc = require("./modules/lirc.js");

lirc.initialize();

// Define static HTML files
app.use(express.static(__dirname + '/public'));

// define GET request for /send/deviceName/buttonName
app.get('/send/:device/:key', function(req, res) {

    var deviceName = req.param("device");
    var key = req.param("key").toUpperCase();

    // Make sure that the user has requested a valid device
    if(!lirc.devices.hasOwnProperty(deviceName)) {
        res.send("Unknown device");
        return;
    }

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
        if(error)
            res.send("Error sending command");
        else
            res.send("Successfully sent command");
    });
});

app.get('/get/devices', function(req, res) {
    return res.send(lirc.devices);
});

// Listen on port 80
app.listen(port);

console.log(lirc.devices);