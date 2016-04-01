
var StreamSplitter = require("stream-splitter");

//Needed variables
var lastclap = Date.now();
var isRecording = false;
var lastclap = Date.now();
var isPi = true;

WHISTLE_MAX_DIFF = 2;
WHISTLE_MIN = 15;
WHISTLE_MAX = 50;



fs.readFile('/etc/os-release', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    if (data.indexOf('raspbian') > -1) {
        isPi = true;
        console.log('pi found');
    }
    console.log(isPi, "IsPi");
});


function checkMic() {


}


whistleListen = spawn('./dist/sndpeek', ['--nodisplay','--print','--rolloff-only']);
var splitter = whistleListen.stdout.pipe(StreamSplitter("\n"));
splitter.encoding = "utf8";
var lastWhistle = Date.now();
var lastTone = 0;
var currentTone = 0;
splitter.on("token", function(token) {
    //console.log("A line of input:", token);
    token = token.split(' ');
    var min = parseFloat(token[0]);
    var max = parseFloat(token[1]);
    var diff = max - min;
    if (diff <= WHISTLE_MAX_DIFF/2 && diff >= -WHISTLE_MAX_DIFF/2 && min >= WHISTLE_MIN && max <= WHISTLE_MAX) {
        //console.log('Whistle detected ', min, max);
        currentTone = (min+max)/2;
        var timeSpent = Date.now() - lastWhistle;

        if (timeSpent <= 500) {
            if (lastTone >= 25 && lastTone <= 35
                && currentTone >= 35 && currentTone <= 45) {
                KaKu('M', '10', 'on')
                console.log('UP!');
            }

            if (currentTone >= 25 && currentTone <= 35
                && lastTone >= 35 && lastTone <= 45) {
                KaKu('M', '10', 'off')
                console.log('DOWN!');
            }
        }
        console.log('NOW['+currentTone+']LAST['+lastTone+']DIFF['+timeSpent+']');

        lastWhistle = Date.now();
        lastTone = (min+max)/2;
    }
});

whistleListen.on('exit', function (code) {
    console.log('child process exited with code ' + code);
});

exec('export AUDIODEV=hw:1,0; export AUDIODRIVER=alsa;');
function checkMicOld() {
    var exportString = '';
    if (isPi) {
        exportString = 'export AUDIODEV=hw:1,0; export AUDIODRIVER=alsa;';
    }
    exec(exportString + 'rec -n stat trim 0 .5 2>&1 | awk \'/^Maximum amplitude/ { print $3 }\'', function(error, stdout) {
        //exec(exportString + 'rec -n stat trim 0 .5 2>&1 ', function(error, stdout) {
        //console.log(stdout);
        if (stdout >= 0.9) {
            var diff = Date.now() - lastclap;
            if (diff <= 2000 && diff >= 200 && isRecording == false) {
                console.log('CLAPCLAP!!');
                listenToSpeech();
            }
            lastclap = Date.now();
        }
        checkMic();
    });
}

checkMic();
