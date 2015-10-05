var voicecommands = {
    witAiKey: '2OSPY3KNG5JEHYFPSWXYV2Z4LV22FJ3O',
    commands: {
        tv_control: function(entities) {
            console.log(entities, entities[0]);
            if (entities['on_off'][0]['value'] == 'on') {
                KaKu("M", 20, "on");
            } else {
                KaKu("M", 20, "off");
            }
        },
        lights_control: function(entities) {
            console.log(entities, entities[0]);
            if (entities['on_off'][0]['value'] == 'on') {
                KaKu("M", 10, "on");
            } else {
                KaKu("M", 10, "off");
            }
        },
        tv_volume: function(entities) {
            console.log(entities, entities[0]);
            if (entities['number'] == undefined || entities['volume'] == undefined) {
                textToSpeech('Can you repeat that?');
                return;
            }
            var volume = (entities['volume'][0]['value']); //lower / higher
            var volumeTicks = (entities['number'][0]['value']);

            if (volume == 'higher') {
                textToSpeech('Turning up the volume');
                for (var i=0; i<volumeTicks; i++) {
                    setTimeout(function() {sendLirc('sonytv', 'KEY_VOLUMEUP')}, 200*(i+1));
                }
            }

            if (volume == 'lower') {
                textToSpeech('Turning down the volume');
                for (var i=0; i<volumeTicks; i++) {
                    setTimeout(function() {sendLirc('sonytv', 'KEY_VOLUMEDOWN')}, 200*(i+1));
                }
            }
        },
        jokes: function(entities) {
            console.log(entities, entities[0]);
            if (entities['joke'] == undefined) {
                textToSpeech('Can you repeat that?');
                return;
            }

            switch (entities['joke'][0]['value']) {
                case 'sweet lovin':
                    textToSpeech('Engaging love making mode');
                    setTimeout(function() {sendLirc('sonytv', 'KEY_VOLUMEDOWN');}, 200);
                    setTimeout(function() {sendLirc('ledstrip', 'KEY_RED');}, 500);
                    setTimeout(function() {KaKu("M", 10, "off");}, 1000);
                    setTimeout(function() {playSound('./dist/letsgetiton.ogg');}, 2000);
                    break;
                case 'joke':
                    textToSpeech('I would love to tell you a joke my dear. But i dont know any.');
                    break;
                case 'yomama':
                    request('http://api.yomomma.info/', function(error, response, body) {
                        body = JSON.parse(body);
                        textToSpeech(body.joke);
                    });

                    break;
            }
        }
    }
}