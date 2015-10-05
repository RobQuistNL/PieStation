var request = require('request');

request.get('http://files.dukesoft.nl/randomjoke.php',
    function(error, response, bodyRes){
        console.log(error);
        if (error != null) {
            textToSpeech('I cant find any jokes, sorry.');
            return;
        }
        textToSpeech(bodyRes);
    }
);