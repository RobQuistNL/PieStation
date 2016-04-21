const readline = require('readline');
const prompt = require('prompt');
const path = require('path');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const wordsApiToken = 'Hql4Qxyh84mshTtz544slEM44IeBp1FF4UXjsnqQb8Ish4EKTu';
const unirest = require('unirest');
const loki = require('lokijs');
var DB = new loki('me.json');
var wordsDB;
const yaml = require('js-yaml');
const fs = require('fs');
var grammar_dictionary = yaml.safeLoad(fs.readFileSync('./dictionary.yaml', 'utf8'));

if (!fs.existsSync('me.json')) {
    wordsDB = DB.addCollection('words');

    DB.save(function() {
        systemLog('> DB Created');
    });
}

var me = {
    what: 'Artificial Intelligence',
    created: '04-05-2016 16:04',
    exist: {
        since: new Date()
    },
    talkingTo: null,
    history: []
};

DB.loadDatabase({}, function () {
    wordsDB = DB.getCollection('words');
    systemLog('> DB Loaded');
    waitForInput();
});

function findWord(obj, word, reverse) {
    if (reverse == undefined) {
        reverse = '';
    }
    for (var k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            var otherFound = findWord(obj[k], word, reverse + '.' + k);
            if (otherFound != false) {
                return otherFound;
            }
        } else {
            //console.log('Check ' + obj[k] + ' vs ' + word + ' - rev:', reverse);
            if (obj[k] == word) {
                return reverse + '.' + k;
            }
        }
    }
    return false;
}

function checkDefinition(word) {
    var found = findWord(grammar_dictionary, word);
    if (typeof found == "string") {
        if (found.substring(0, 1) == '.') {
            return found.substring(1);
        }
    }
    if (found == false) {
        found = wordsDB.find({'word':word});
    }
    if (found.length <= 0) {
        learnWord(word);
        return false;
    }
    return found;
}

function systemLog(text) {
    console.log(colors.green(text));
}

function speakLog(text) {
    console.log(colors.red(text));
}

function brainLog(text) {
    console.log(colors.blue(text));
}

function learnWord(word) {
    //Consume the wordsapi to learn this word
    systemLog('>> Looking up word ' + word);
    unirest.get("https://wordsapiv1.p.mashape.com/words/" + word)
        .header("X-Mashape-Key", wordsApiToken)
        .header("Accept", "application/json")
        .end(function (result) {
            var response = result.body;
            var object;
            if (response.results == undefined) {
                systemLog('undefined word in api: ' + word, 'Response:');
                systemLog(result.body);
                object = { 'unknown': 'unknown' }
            } else {
                object = response.results[0];
            }
            object['word'] = word;
            wordsDB.insert(object);
            systemLog('>>> Learned word ' + word);
            DB.save(function() {
                systemLog('>> DB Saved');
            });
        });
}
var assign = require('object.assign/polyfill')();
var nlp = require('../node_modules/nlp_compromise');
var colors = require('colors');

const SPEAKER_SELF = -1;

const SENT_DECLARATIVE = 'declarative';
const SENT_INTERROGATIVE = 'interrogative';
const SENT_EXCLAMATIVE = 'exclamative';

function ask(question) {
    //-1 = self
    var nlpSentence = nlp.sentence(question);
    me.history.push({speaker: SPEAKER_SELF, sentence: nlpSentence});
    speakLog(colors.red('> ' + question));
}

function listen(text) {
    var nlpSentence = nlp.sentence(text);
    me.history.push({speaker: me.talkingTo, sentence: nlpSentence});

    if (me.history[me.history.length -1].speaker == SPEAKER_SELF) { //If i just asked a question
        if (me.history[me.history.length -1].sentence.sentence_type() == SENT_INTERROGATIVE) {
            //What did i ask?
            brainLog('I just asked a question.'.blue);
            brainLog('The answer will define: '.blue);
            brainLog(colors.blue(me.history[me.history.length -1].sentence))
        }
    }

    if (me.talkingTo == null) {
        return ask('Who are you?');
    }

    switch (nlpSentence.sentence_type()) {
        case 'declarative':

            break;

        case 'interrogative':

            break;

        case 'exclamative':

            break;
    }
    //console.log(nlpSentence, nlpSentence.sentence_type());
    //console.log(nlp_compromise.sentence.tags(text));
}



