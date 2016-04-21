//Requires
var exec = require('child_process').exec;
var path = require('path');
var lpcm16 = require('node-record-lpcm16');
var request = require('request');
var sprintf = require("sprintf-js").sprintf,
    vsprintf = require("sprintf-js").vsprintf;
var isRecording = false;
var express = require('express');
var app = express();
var nlp = require('nlp_compromise');
var colors = require('colors');
var http = require('http').Server(app);

var WITAI_KEY = '2OSPY3KNG5JEHYFPSWXYV2Z4LV22FJ3O';

var interrogative_adverb_property_map = {
    'who': 'person',
    'where': 'location',
    'when': 'moment',
    'why': 'reaon',
    'what': 'object',
    'which': 'choice',
    'how': 'method'
};

const SPEAKER_SELF = -1;

const SENT_DECLARATIVE = 'declarative';
const SENT_INTERROGATIVE = 'interrogative';
const SENT_EXCLAMATIVE = 'exclamative';

var me = {
    what: 'Artificial Intelligence',
    created: '04-05-2016 16:04',
    exist: {
        since: new Date()
    },
    talkingTo: null
};

var speakingHistory = [];

if (process.argv[2] != 'test') {
    http.listen(8080, function(){
        console.log('listening on *:8080');
    });
} else {
    testThis();
}



function stopListening() {
    if (isRecording == false) {
        return;
    }
    console.log('Stop recording');
    lpcm16.stop();
    isRecording = false;
}

function listenToSpeech() {
    if (isRecording == true) {
        return;
    }
    console.log('Recording...');
    isRecording = true;
    lpcm16.start({
        verbose: false,
        recordProgram: 'arecord',
        cmdArgs: ['-D', 'plughw:1,0']
    }).pipe(request.post({
            'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
            'headers' : {
                'Accept'        : 'application/vnd.wit.20160202+json',
                'Authorization' : 'Bearer ' + WITAI_KEY,
                'Content-Type'  : 'audio/wav'
            }
        }, function(err,httpResponse,body) {
            isRecording = false;
            //console.log(body);
            try {
                //console.log(JSON.parse(body));
                listen(JSON.parse(body)._text);
            } catch (exception) {
                console.log(exception);
            }

        }));
    setTimeout(function () {
        stopListening();
    }, 5000);
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'speechtest.html'));
});

app.get('/text/:text', function(req, res) {
    listen(req.params.text);
    res.send('Received');
});

app.get('/listen', function(req, res) {
    listenToSpeech();
    res.send('Listening');
});

app.get('/stop', function(req, res) {
    stopListening();
    res.send('Stopped listening');
});

function systemLog(text) {
    console.log(colors.green(text));
}

function speakLog(text) {
    console.log(colors.red(text));
}

function brainLog(text) {
    console.log(colors.blue(text));
}

function ask(question) {
    //-1 = self
    var nlpSentence = nlp.sentence(question);
    speakingHistory.push({speaker: SPEAKER_SELF, sentence: nlpSentence});
    speakLog(colors.red('> ' + question));
}

function state(text) {
    //-1 = self
    var nlpSentence = nlp.sentence(text);
    speakingHistory.push({speaker: SPEAKER_SELF, sentence: nlpSentence});
    speakLog(colors.red('> ' + text));
}

function understand(spokenSentence) {
    var sentence = spokenSentence.sentence;
    var speaker = spokenSentence.speaker;

    var understanding = {
        property: undefined,
        subject: undefined,
        value: undefined,
        type: sentence.sentence_type(),
        plainAnswer: false
    };

    for (i=0; i< sentence.terms.length; i++) {
        var word = sentence.terms[i];
        var wordType = word.constructor.name;

        if (wordType == 'Adverb' || wordType == 'Term') {
            if (interrogative_adverb_property_map[word.normal] != undefined) {
                understanding.property = interrogative_adverb_property_map[word.normal];
            }
        }

        if (wordType == 'Noun' && understanding.property == undefined || (wordType == 'Term' && word.tag == 'Determiner')) {
            understanding.property = word.normal;
        }

        if (wordType == 'Person' && word.pos.Noun == true) {
            understanding.value = word.normal;
        }

        if (wordType == 'Term' && word.tag == 'Posessive' || wordType == 'Person') {
            switch (word.normalize()) {
                case 'you':
                case 'your':
                case 'yours':
                    if (speaker == me.talkingTo) {
                        understanding.subject = me;
                    }
                    if (speaker == SPEAKER_SELF) {
                        understanding.subject = me.talkingTo;
                    }
                    break;
                case 'i':
                case 'me':
                case 'my':
                case 'mine':
                    understanding.subject = speaker;
                    break;
            }
        }
    }

    if (understanding.property == undefined && understanding.subject == undefined && understanding.value != undefined) {
        understanding.plainAnswer = true;
    }

    return understanding;
}

function listen(text) {
    console.log(text);

    var nlpSentence = nlp.sentence(text);
    var speakObject = {speaker: me.talkingTo, sentence: nlpSentence};
    speakingHistory.push(speakObject);
    var understanding = understand(speakObject);
    var previousSpeaking = speakingHistory[speakingHistory.length -2];
    if (previousSpeaking != undefined) {
        var previousUnderstanding = understand(previousSpeaking);
        if (previousSpeaking.speaker == SPEAKER_SELF) { //If i just asked a question
            if (previousSpeaking.sentence.sentence_type() == SENT_INTERROGATIVE) {
                brainLog('I just asked a question.');
                brainLog('The answer will define ' + previousUnderstanding.property + ' of ' + previousUnderstanding.subject);
                if (understanding.type == SENT_DECLARATIVE && understanding.plainAnswer == true) {
                    brainLog('I just got a plain answer.');
                    previousUnderstanding.subject[previousUnderstanding.property] = understanding.value;
                    return state('Okay.');
                }
            }
        }
    }

    if (me.talkingTo == null) {
        me.talkingTo = new Object();
        return ask('What is your name?');
    }

    switch (nlpSentence.sentence_type()) {
        case 'declarative':
            brainLog(me.talkingTo.name + ' just declared that the ' + understanding.property + ' of ' + understanding.subject + ' is ' + understanding.value);
            if (understanding.property != undefined && understanding.subject != undefined && understanding.value != undefined) {
                understanding.subject[understanding.property] = understanding.value;
            }
            console.log(understanding, nlpSentence);
            break;

        case 'interrogative':
            console.log(understanding, nlpSentence);
            brainLog(me.talkingTo.name + ' just asked a question (want to know ' + understanding.property + ' of ' + understanding.subject);
            if (understanding.property != undefined && understanding.subject != undefined) {
                if (understanding.subject[understanding.property] == undefined) {
                    state('I dont know!');
                } else {
                    var subjectShorthand =  understanding.subject.name + "'s";
                    if (understanding.subject == me) {
                        subjectShorthand = 'my';
                    }
                    if (understanding.subject == me.talkingTo) {
                        subjectShorthand = 'your';
                    }
                    state('I think ' + subjectShorthand + ' ' + understanding.property + ' is ' + understanding.subject[understanding.property]);
                }
            } else {
                console.log(understanding, nlpSentence);
            }
            break;

        case 'exclamative':

            break;
    }
    //console.log(nlpSentence, nlpSentence.sentence_type());
    //console.log(nlp_compromise.sentence.tags(text));
}

function assertSame(expectation, reality) {
    if (expectation != reality) {
        throw 'Test fail - ' + expectation + ' != ' + reality;
    }
}

function testThis()
{
    testOne();
    testTwo();
}

function testOne() {
    var speaker = {};
    var nlpSentence =  nlp.sentence('My name is Rob');
    var testString = understand({sentence: nlpSentence, speaker: speaker});
    assertSame(testString.property, 'name');
    assertSame(testString.subject, speaker);
    assertSame(testString.value, 'rob');
    assertSame(testString.type, SENT_DECLARATIVE);
    assertSame(testString.plainAnswer, false);
}


function testTwo() {
    var speaker = {};
    var nlpSentence =  nlp.sentence('Rob is my name');
    var testString = understand({sentence: nlpSentence, speaker: speaker});
    assertSame(testString.property, 'name');
    assertSame(testString.subject, speaker);
    assertSame(testString.value, 'rob');
    assertSame(testString.type, SENT_DECLARATIVE);
    assertSame(testString.plainAnswer, false);
}