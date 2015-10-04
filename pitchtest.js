var detectPitch = require('detect-pitch')
var coreaudio  = require('node-core-audio');
//var qt = require('node-qt');

//@see http://github.com/ZECTBynmo/node-core-audio/issues/33
//Create a core audio engine
var engine = coreaudio.createNewAudioEngine();
engine.setOptions({ inputChannels: 1, outputChannels: 2, interleaved: true });

var sample = 0;
var ampBuffer = new Float32Array(4000);

engine.addAudioCallback(function(buffer) {
    var output = [];
    for (var i = 0; i < buffer.length; i++, sample++) {
        //Pan two sound-waves back and forth, opposing
        var val1 = Math.sin(sample * 110.0 * 2 * Math.PI / 44100.0) * 0.25, val2 = Math.sin(sample * 440.0 * 2 * Math.PI / 44100.0) * 0.25;
        var pan1 = Math.sin(1 * Math.PI * sample / 44100.0), pan2 = 1 - pan1;

        output.push(val1 * pan1 + val2 * pan2); //left channel
        output.push(val1 * pan2 + val2 * pan1); //right channel

        //Save microphone input into rolling buffer
        ampBuffer[sample%ampBuffer.length] = buffer[i];
    }
    return output;
});
/*
setInterval(function() {
    console.log(detectPitch(ampBuffer));
}, 10);
*/
/*
var n = 1024
var ω = 2.0 * Math.PI / n

//Initialize signal
var signal = new Float32Array(n)
for(var i=0; i<n; ++i) {
    signal[i] = Math.sin(100 * i * ω)
}

console.log(Math.round(n / detectPitch(signal)));*/