
var MIC = require('mic-sdk-js').default

var AWSMqtt = require('aws-mqtt-client')

var mqttConnect = function() {
    var api = new MIC; 
    var mqttClient
    // Init by providing the endpoint for your app
    api.init('startiot.mic.telenorconnexion.com')
    .then((manifest, credentials) => {
        // Login a user
        api.login('vbe013', 'GGwpGGwp4567')
        .then(user => {
            
            // Init a new MQTT client
            mqttClient = new AWSMqtt({
                region:                 api._AWS.config.region,
                accessKeyId:            api._AWS.config.credentials.accessKeyId,
                secretAccessKey:        api._AWS.config.credentials.secretAccessKey,
                sessionToken:           api._AWS.config.credentials.sessionToken,
                endpointAddress:        api._manifest.IotEndpoint,
                maximumReconnectTimeMs: 8000
            }).catch(err => console.log('Error: ', err));
            mqttClient.on('connect', () => connect())
            mqttClient.on('message', (topic, message) => message())
        }).catch(err => console.log('Error: ', err));
        var connect = function() {
            mqttClient.subscribe('thing-update/my/topic/#', {qos: 1}, (err, granted) => {
                if (err)
                console.log(err)
            })
        }
        var message = function(topic, message) {
            console.log("MESSAGE FROM DEVICE: ", topic, message.toString('utf-8'))
        }
    }).catch(err => console.log('Error: ', err));

}

    
mqttConnect()