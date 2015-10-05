var request = require('request');

var code = 'AAAAAQAAAAEAAAATAw==';

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

//Set volume
var body = '<?xml version="1.0"?>' +
    '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
    '<SOAP-ENV:Body>' +
        '<m:SetVolume xmlns:m="urn:schemas-upnp-org:service:RenderingControl:1">' +
            '<InstanceID xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="ui4">0</InstanceID>' +
            '<Channel xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="string">Master</Channel>' +
            '<DesiredVolume xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="ui2">30</DesiredVolume>' +
        '</m:SetVolume></SOAP-ENV:Body>' +
    '</SOAP-ENV:Envelope>';
var url = 'http://192.168.178.11:52323/upnp/control/RenderingControl';

request.post(
    {
        proxy: 'http://127.0.0.1:8888',
        headers: {
            'Content-Type': 'text/xml; charset="utf-8"',
            'SOAPAction': '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"'
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