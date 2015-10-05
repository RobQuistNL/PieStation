var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

var channels = JSON.parse(fs.readFileSync('./public/config/channels.json'));

var voicecommands = {
    witAiKey: 'xxx',
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
        tv_channel: function(entities) {
            if (entities['channel'] == undefined) {
                textToSpeech('Can you repeat that?');
                return;
            }

            if (entities['channel'][0]['value'] == 'computer') {
                textToSpeech('Nerd');
                sonybravia.sendIRCC('hdmi3');
                return;
            }

            if (entities['channel'][0]['value'] == 'playstation') {
                textToSpeech('Have fun');
                sonybravia.sendIRCC('hdmi4');
                return;
            }

            if (entities['channel'][0]['value'] == 'tv') {
                sonybravia.sendIRCC('hdmi1');
                return;
            }

            sonybravia.sendIRCC('hdmi1'); //TV
            var channelNumber = undefined;
            var pad = '000';
            if (entities['number'] != undefined) {
                textToSpeech('Switching TV to channel ' + entities['number'][0]['value']);
                channelNumber = '' + entities['number'][0]['value'];
            } else {
                _.each(channels, function(channel) {
                    if (channel.name.toLowerCase() == entities['channel'][0]['value'].toLowerCase()) {
                        channelNumber = '' + channel.channel;
                        textToSpeech('Switching TV to ' + entities['channel'][0]['value']);
                    }
                });
            }
            if (channelNumber != undefined) {
                channelNumber = pad.substring(0, pad.length - channelNumber.length) + channelNumber;
                var sendingTimeout = 500;
                var __key_0 = 'KEY_'+channelNumber.charAt(0);
                var __key_1 = 'KEY_'+channelNumber.charAt(1);
                var __key_2 = 'KEY_'+channelNumber.charAt(2);
                setTimeout(function() {sendLirc('humax', __key_0);},sendingTimeout);
                setTimeout(function() {sendLirc('humax', __key_1);},sendingTimeout*2);
                setTimeout(function() {sendLirc('humax', __key_2);},sendingTimeout*3);
                setTimeout(function() {console.log("irsend SEND_ONCE ledstrip "+lastLedKey); lirc.exec("irsend SEND_ONCE ledstrip "+lastLedKey, function(error, stdout, stderr){});},sendingTimeout*4);
            }
        },
        tv_volume: function(entities) {
            if (entities['number'] == undefined) {
                textToSpeech('Can you repeat that?');
                return;
            }

            if (entities['number'][0]['value'] > 50) {
                textToSpeech('volume to ' + entities['number'][0]['value'] + '. lol. really? i am not doing that you idiot');
            } else {
                tv_volume = entities['number'][0]['value'];
                sonybravia.setVolume(entities['number'][0]['value']);
            }
        },
        light_color: function(entities) {
            if (entities['color'] == undefined) {
                textToSpeech('I have no idea what colour you ment');
                return;
            }

            if (entities['color'][0]['value'] != 'off') {
                sendLirc('ledstrip', 'KEY_POWER');
            } else {
                sendLirc('ledstrip', 'KEY_POWER2');
                return;
            }

            var colormap = {
                green: 'KEY_GREEN',
                blue: 'KEY_BLUE',
                red: 'KEY_RED',
                lightblue: 'KEY_0',
                purple: 'KEY_F6',
                darkblue: 'KEY_F3',
                darkgreen: 'KEY_BRL_DOT1',
                yellow: 'KEY_BRL_DOT4',
                deepblue: 'KEY_F5',
                strobe: 'KEY_4',
                rainbow: 'KEY_3',
            };
            var wishedColor = entities['color'][0]['value'].replace(/\s+/g, '').toLowerCase();
            if (colormap[wishedColor] != undefined) {
                setTimeout(function(){sendLirc('ledstrip', colormap[wishedColor]);}, 400);
            } else {
                textToSpeech('Those lights dont support the color ' + entities['color'][0]['value']);
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
                    for (var i = 0; i <= 15; i++) {
                        setTimeout(function() {sendLirc('sonytv', 'KEY_VOLUMEDOWN');}, 1000*i);
                    }
                    setTimeout(function() {sendLirc('ledstrip', 'KEY_RED');}, 500);
                    setTimeout(function() {KaKu("M", 10, "off");}, 1000);
                    setTimeout(function() {playSound('./dist/letsgetiton.ogg');}, 2000);
                    break;
                case 'joke':
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
                    break;
                case 'yomama':
                    request('http://api.yomomma.info/', function(error, response, body) {
                        body = JSON.parse(body);
                        textToSpeech(body.joke);
                    });

                    break;
                case 'chuck':
                    request('http://api.icndb.com/jokes/random', function(error, response, body) {
                        body = JSON.parse(body);
                        textToSpeech(body.value.joke);
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
            var date = null;
            var today = new Date();
            var diffDays = 0; //Defaults to today
            if (entities['datetime'] != undefined) {

                if (entities['datetime'][0].type == 'interval') {
                    date = new Date(entities['datetime'][0].from.value);
                }

                if (entities['datetime'][0].type == 'value') {
                    date = new Date(entities['datetime'][0].values[0].value);
                }

                console.log('Searching for date:', date);
                diffDays = dateDiffInDays(today, date);
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
            //console.log('Opening url:'+url, diffDays);
            request(url, function(a, b, body) {
                var exported = JSON.parse(body);
                console.log(exported);
                var description = 'unknown';
                var clouds = 'unknown';
                var speed = 'unknown';
                var tempstring = 'Im not sure what to say about the temperature. ';
                var shorttempstring = '';

                if (exported.list != undefined) {
                    var asked = exported.list[diffDays-1];
                    description = asked.weather[0].description;

                    tempstring = 'In the morning it will be around '+asked.temp.morn+' degrees, during the day ' +
                        'it will be around '+asked.temp.day+', avaraging on '+asked.temp.eve+' degrees centigrade. ';
                    shorttempstring = 'Temperatures around '+Math.round(asked.temp.eve)+' degrees. ';

                    clouds = asked.clouds;
                    speed = asked.speed;
                } else {
                    description = exported.weather[0].description;

                    tempstring = 'The temperature will be between '+Math.round(exported.main.temp_min)+' and ' +
                        Math.round(exported.main.temp_max)+' degrees centigrade, averaging on '+Math.round(exported.main.temp)+' degrees. ';
                    shorttempstring = 'Temperatures around '+Math.round(exported.main.temp)+' degrees. ';

                    clouds = exported.clouds.all;
                    speed = exported.wind.speed;
                }

                switch (checkfor) {
                    case 'general':
                        sonybravia.setVolume(0);
                        setTimeout(function(){sonybravia.setVolume(tv_volume)}, 10000);
                        textToSpeech(dateAsText + ' in ' + location + ' i would say "'+description+'". ' +
                            shorttempstring + '. ' + clouds + ' percent cloudy');
                        break;
                    case 'temperature':
                        setTimeout(function(){sonybravia.setVolume(tv_volume)}, 5000);
                        textToSpeech(tempstring  + dateAsText + ' in ' + location);
                        break;
                    case 'rain':
                        setTimeout(function(){sonybravia.setVolume(tv_volume)}, 5000);
                        textToSpeech('I would say "'+description+'" ' + dateAsText + ' in ' + location);
                        break;
                    case 'snow':
                        setTimeout(function(){sonybravia.setVolume(tv_volume)}, 5000);
                        textToSpeech('I am quite sure if it will snow ' + dateAsText);
                        break;
                    default:
                        textToSpeech('Sorry, i can not handle questions about ' + checkfor + ' yet. Go ahead, spank rob.');
                        break;
                }
            });
        }
    }
}