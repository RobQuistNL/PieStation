(function() {
    module.exports.devices = {};

    module.exports.request = require('request');

    module.exports.setVolume = function(volume) {
        var body = '<?xml version="1.0"?>' +
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
            '<SOAP-ENV:Body>' +
            '<m:SetVolume xmlns:m="urn:schemas-upnp-org:service:RenderingControl:1">' +
            '<InstanceID xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="ui4">0</InstanceID>' +
            '<Channel xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="string">Master</Channel>' +
            '<DesiredVolume xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="ui2">'+ volume +'</DesiredVolume>' +
            '</m:SetVolume></SOAP-ENV:Body>' +
            '</SOAP-ENV:Envelope>';
        var url = 'http://192.168.178.12:52323/upnp/control/RenderingControl';

        module.exports.request.post(
            {
                headers: {
                    'Content-Type': 'text/xml; charset="utf-8"',
                    'SOAPAction': '"urn:schemas-upnp-org:service:RenderingControl:1#SetVolume"'
                },
                uri: url,
                body: body,
                method: 'POST'
            },
            function(error, response, bodyRes){
                //console.log(error);
                //console.log(bodyRes);
            }
        );
    };

    module.exports.sendIRCC = function(IIRC) {
        var irccCommands = {
            hdmi1: 'AAAAAgAAABoAAABaAw==',
            hdmi2: 'AAAAAgAAABoAAABbAw==',
            hdmi3: 'AAAAAgAAABoAAABcAw==',
            hdmi4: 'AAAAAgAAABoAAABdAw=='
        };

        var code=irccCommands[IIRC];
        var body = '<?xml version="1.0"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><m:X_SendIRCC xmlns:m="urn:schemas-sony-com:service:IRCC:1"><IRCCCode xmlns:dt="urn:schemas-microsoft-com:datatypes" dt:dt="string">'+code+'</IRCCCode></m:X_SendIRCC></SOAP-ENV:Body></SOAP-ENV:Envelope>';
        var url = 'http://192.168.178.12/IRCC';

        module.exports.request.post(
            {
                headers: {
                    'Content-Type': 'text/xml; charset="utf-8"',
                    'SOAPAction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
                },
                uri: url,
                body: body,
                method: 'POST'
            },
            function(error, response, bodyRes){
                //console.log(error);
                //console.log(bodyRes);
            }
        );
    };

}());