var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


var voicecommands = {
    witAiKey: '2OSPY3KNG5JEHYFPSWXYV2Z4LV22FJ3O',
    commands: {
        tv_control: function(entities) {
            if (entities['on_off'][0]['value'] == 'on') {
                KaKu("M", 20, "on");
            } else {
                KaKu("M", 20, "off");
            }
        },
        lights_control: function(entities) {
            if (entities['on_off'][0]['value'] == 'on') {
                KaKu("M", 10, "on");
            } else {
                KaKu("M", 10, "off");
            }
        },
        tv_volume: function(entities) {
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
        },
        weather: function(entities) {
            //Check for type
            var checkfor = 'general';
            if (entities['weather_types'] != undefined) {
                checkfor = entities['weather_types'][0].value;
            }

            console.log('Checking for: ' + checkfor);

            var date = 'today';
            var today = new Date();
            if (entities['datetime'] != undefined) {

                if (entities['datetime'][0].type == 'interval') {
                    date = new Date(entities['datetime'][0].from.value);
                }

                if (entities['datetime'][0].type == 'value') {
                    date = new Date(entities['datetime'][0].values[0].value);
                }

                console.log('Searching for date:', date);
                var diffDays = dateDiffInDays(today, date);
                if (diffDays < 0) {
                    diffDays = 0;
                }
            }

            var dateAsText = moment(date).fromNow();

            if (diffDays == 0) {
                dateAsText = 'today';
            }
            if (diffDays == 1) {
                dateAsText = 'tomorrow';
            }

            var location = 'leusden';

            if (entities['location'] != undefined) {
                location = entities['location'][0].value;
            }

            console.log('location: ' + location);

            //Data has been parsed. Now go and check the API!
            var api = 'http://api.openweathermap.org/data/2.5/';
            var url = '';
            if (diffDays == 0) { //today
                url = api + 'weather?q=' + location + '&units=metric';
            }
            if (diffDays >= 1) { //more days
                url = api + 'forecast/daily?q='+location+'&units=metric&cnt='+diffDays;
            }

            request(url, function(a, b, body) {
                var exported = JSON.parse(body);
                //console.log(exported);
                var description = 'unknown';
                var clouds = 'unknown';
                var speed = 'unknown';
                var tempstring = 'Im not sure what to say about the temperature. ';

                if (exported.list != undefined) {
                    var asked = exported.list[diffDays-1];
                    description = asked.weather[0].description;

                    tempstring = 'In the morning it will be around '+asked.temp.morn+' degrees, during the day ' +
                    'it will be around '+asked.temp.day+', avaraging on '+asked.temp.eve+' degrees centigrade. ';

                    clouds = asked.clouds;
                    speed = asked.speed;
                } else {
                    description = exported.weather[0].description;

                    tempstring = 'The temperature will be between '+exported.main.temp.temp_min+' and ' +
                        exported.main.temp.temp_max+' degrees centigrade, avaraging on '+exported.main.temp.temp+' degrees. ';

                    clouds = exported.clouds.all;
                    speed = exported.wind.speed;
                }

                switch (checkfor) {
                    case 'general':
                        textToSpeech(dateAsText + ' in ' + location + ' i would say "'+description+'". ' + tempstring +
                            ' It will be ' + clouds + ' percent cloudy and wind speeds will be around ' + speed +
                            ' meters per second.');
                        break;
                    case 'temperature':
                        textToSpeech('About the temperature ' + dateAsText + ' in ' + location + ' i would say ' + tempstring);
                        break;
                    case 'rain':
                        textToSpeech('It is '+clouds+' percent cloudy, overall i would say "'+description+'" ' + dateAsText + ' in ' + location);
                        break;
                    case 'snow':
                        textToSpeech('I am quite sure that it will not snow ' + dateAsText);
                        break;
                    default:
                        textToSpeech('Sorry, i can not handle questions about ' + checkfor + ' yet. Go ahead, spank rob.');
                        break;
                }
            });
        }
    }
}