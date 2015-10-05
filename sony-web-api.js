var request = require('request');

//var code = 'AAAAAQAAAAEAAAATAw==';

//'HDMI1': 'AAAAAgAAABoAAABaAw==',
//    'HDMI2': 'AAAAAgAAABoAAABbAw==',
//    'HDMI3': 'AAAAAgAAABoAAABcAw==',
//    'HDMI4': 'AAAAAgAAABoAAABdAw==',
/*
var body = '<?xml version="1.0"?>' +
    '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
    '<s:Body>' +
    '<u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">' +
        '<IRCCCode>AAAAAgAAABoAAABbAw==</IRCCCode>' +
        '</u:X_SendIRCC>' +
    '</s:Body>' +
    '</s:Envelope>'
*/

/*
 'Analog': 'AAAAAgAAAHcAAAANAw==',
 'Audio': 'AAAAAQAAAAEAAAAXAw==',
 'Blue': 'AAAAAgAAAJcAAAAkAw==',
 'ChannelDown': 'AAAAAQAAAAEAAAARAw==',
 'ChannelUp': 'AAAAAQAAAAEAAAAQAw==',
 'Confirm': 'AAAAAQAAAAEAAABlAw==',
 'Display': 'AAAAAQAAAAEAAAA6Aw==',
 'Down': 'AAAAAQAAAAEAAAB1Aw==',
 'EPG': 'AAAAAgAAAKQAAABbAw==',
 'Exit': 'AAAAAQAAAAEAAABjAw==',
 'Forward': 'AAAAAgAAAJcAAAAcAw==',
 'Green': 'AAAAAgAAAJcAAAAmAw==',
 'Home': 'AAAAAQAAAAEAAABgAw==',
 'Input': 'AAAAAQAAAAEAAAAlAw==',
 'Left': 'AAAAAQAAAAEAAAA0Aw==',
 'Mute': 'AAAAAQAAAAEAAAAUAw==',
 'Next': 'AAAAAgAAAJcAAAA9Aw==',
 'Num0': 'AAAAAQAAAAEAAAAJAw==',
 'Num1': 'AAAAAQAAAAEAAAAAAw==',
 'Num2': 'AAAAAQAAAAEAAAABAw==',
 'Num3': 'AAAAAQAAAAEAAAADAw==',
 'Num4': 'AAAAAQAAAAEAAAADAw==',
 'Num5': 'AAAAAQAAAAEAAAAEAw==',
 'Num6': 'AAAAAQAAAAEAAAAFAw==',
 'Num7': 'AAAAAQAAAAEAAAAGAw==',
 'Num8': 'AAAAAQAAAAEAAAAHAw==',
 'Num9': 'AAAAAQAAAAEAAAAIAw==',
 'Options': 'AAAAAgAAAJcAAAA2Aw==',
 'PAP': 'AAAAAgAAAKQAAAB3Aw==',
 'Pause': 'AAAAAgAAAJcAAAAZAw==',
 'Play': 'AAAAAgAAAJcAAAAaAw==',
 'Prev': 'AAAAAgAAAJcAAAA8Aw==',
 'Red': 'AAAAAgAAAJcAAAAlAw==',
 'Return': 'AAAAAgAAAJcAAAAjAw==',
 'Rewind': 'AAAAAgAAAJcAAAAbAw==',
 'Right': 'AAAAAQAAAAEAAAAzAw==',
 'Stop': 'AAAAAgAAAJcAAAAYAw==',
 'SubTitle': 'AAAAAgAAAJcAAAAoAw==',
 'SyncMenu': 'AAAAAgAAABoAAABYAw==',
 'Up': 'AAAAAQAAAAEAAAB0Aw==',
 'VolumeDown': 'AAAAAQAAAAEAAAATAw==',
 'VolumeUp': 'AAAAAQAAAAEAAAASAw==',
 'Wide': 'AAAAAgAAAKQAAAA9Aw==',
 'Yellow': 'AAAAAgAAAJcAAAAnAw==',
 'HDMI1': 'AAAAAgAAABoAAABaAw==',
 'HDMI2': 'AAAAAgAAABoAAABbAw==',
 'HDMI3': 'AAAAAgAAABoAAABcAw==',
 'HDMI4': 'AAAAAgAAABoAAABdAw==',

 //not tested:
 'Replay': 'AAAAAgAAAJcAAAB5Aw==',
 'Advance': 'AAAAAgAAAJcAAAB4Aw==',
 'TopMenu': 'AAAAAgAAABoAAABgAw==',
 'PopUpMenu': 'AAAAAgAAABoAAABhAw==',
 'Eject': 'AAAAAgAAAJcAAABIAw==',
 'Rec': 'AAAAAgAAAJcAAAAgAw==',
 'ClosedCaption': 'AAAAAgAAAKQAAAAQAw==',
 'Teletext': 'AAAAAQAAAAEAAAA/Aw==',
 'GGuide': 'AAAAAQAAAAEAAAAOAw==',
 'DOT' : 'AAAAAgAAAJcAAAAdAw==',
 'Digital': 'AAAAAgAAAJcAAAAyAw==',
 'BS' : 'AAAAAgAAAJcAAAAsAw==',
 'CS' : 'AAAAAgAAAJcAAAArAw==',
 'BSCS': 'AAAAAgAAAJcAAAAQAw==',
 'Ddata': 'AAAAAgAAAJcAAAAVAw==',
 'InternetWidgets': 'AAAAAgAAABoAAAB6Aw==',
 'InternetVideo': 'AAAAAgAAABoAAAB5Aw==',
 'SceneSelect': 'AAAAAgAAABoAAAB4Aw==',
 'Mode3D' : 'AAAAAgAAAHcAAABNAw==',
 'iManual' : 'AAAAAgAAABoAAAB7Aw==',
 'Jump' : 'AAAAAQAAAAEAAAA7Aw==',
 'MyEPG': 'AAAAAgAAAHcAAABrAw==',
 'ProgramDescription': 'AAAAAgAAAJcAAAAWAw==',
 'WriteChapter': 'AAAAAgAAAHcAAABsAw==',
 'TrackID' : 'AAAAAgAAABoAAAB+Aw==',
 'TenKey': 'AAAAAgAAAJcAAAAMAw==',
 'AppliCast': 'AAAAAgAAABoAAABvAw==',
 'acTVila': 'AAAAAgAAABoAAAByAw==',
 'DeleteVideo': 'AAAAAgAAAHcAAAAfAw==',
 'EasyStartUp': 'AAAAAgAAAHcAAABqAw==',
 'OneTouchTimeRec': 'AAAAAgAAABoAAABkAw==',
 'OneTouchView' : 'AAAAAgAAABoAAABlAw==',
 'OneTouchRec' : 'AAAAAgAAABoAAABiAw==',
 'OneTouchRecStop' : 'AAAAAgAAABoAAABjAw==',
 */

//Set volume
var code = 'AAAAAgAAABoAAABcAw==';
var body = '<?xml version="1.0"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><m:X_SendIRCC xmlns:m="urn:schemas-sony-com:service:IRCC:1"><IRCCCode xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="string">'+code+'</IRCCCode></m:X_SendIRCC></SOAP-ENV:Body></SOAP-ENV:Envelope>';
var url = 'http://192.168.178.11/IRCC';

request.post(
    {
        proxy: 'http://127.0.0.1:8888',
        headers: {
            'Content-Type': 'text/xml; charset="utf-8"',
            'SOAPAction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
        },
        uri: url,
        body: body,
        method: 'POST'
    },
    function(error, response, bodyRes){
        console.log(error);
        console.log(bodyRes);
    }
);