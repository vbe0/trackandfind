
var MIC = require('mic-sdk-js').default

var AWSMqtt = require('aws-mqtt-client').default

var WebSocketServer = require("ws").Server

var mqttConnect = function(server) {
    var api = new MIC; 
    var mqttClient
    var wss = new WebSocketServer({server: server})
    var clients = []

    wss.on('request', function(request) {
        console.log((new Date()) + ' Connection from origin '
            + request.origin + '.');
      
        var connection = request.accept(null, request.origin); 
        // we need to know client index to remove them on 'close' event
        var index = clients.push(connection) - 1;
        var userName = false;
        var userColor = false;
      
        console.log((new Date()) + ' Connection accepted.');
        
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
                })
                mqttClient.on('connect', () => connect())
                mqttClient.on('message', (topic, message) => messagee(topic, message))
            })
            var connect = function() {
                mqttClient.subscribe('thing-update/INF-3910-3-v18/animal_tracker/#', {qos: 1}, (err, granted) => {
                    if (err)
                    console.log(err)
                })
                console.log("Connecting to clients")
                //publish("thing-update/INF-3910-3-v18/00001323", "GGWP")
            }
            var messagee = function(topic, message) {
                //console.log("MESSAGE FROM DEVICE: ", topic, message.toString('utf-8'))
                lastMsgs[topic] = message
                s = JSON.parse(message.toString())['state']['reported']['payload'];
                console.log('Topic: ', topic, 'Message: ', s)
                // broadcast message to all connected clients
                var json = JSON.stringify({topic: topic, message: s});
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
                // // Broadcast the message to any connected socket clients
                // wss.on("connection", function(ws) {
                //     console.log("Sending...")
                //     ws.send(JSON.stringify({topic: topic, message: s}), function() {  })
                // })
            }

            var publish = function(topic, message) {
                mqttClient.publish(topic, message, {qos: 1}, (err) => {
                if (!err)
                    console.log('Payload published')
                else
                    console.log('Something went wrong')
                })
            }
        })

        connection.on('close', function(connection) {
            // remove user from the list of connected clients
            clients.splice(index, 1);
        });
    })
}



module.exports = 
{
    getSensorData: mqttConnect
}