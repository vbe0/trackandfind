var awsIot = require('aws-iot-device-sdk');





var thingName = '00001319'; // Replace with your own thing name

var http = require('http');
var fs = require("fs");
var io = require('socket.io')(3000);

var device = awsIot.device({
   keyPath: './certs/privkey.pem',
  certPath: './certs/cert.pem',
    caPath: './certs/ca.pem',
  clientId: thingName,
      host: 'a31ovqfkmg1ev8.iot.eu-west-1.amazonaws.com'
});

module.exports = 
{
    getSensorData: function () {

        // When the MQTT client connects, subscribe to the thing topic
        device.on('connect', function() {
        console.log('Client connected');
        device.subscribe('$aws/things/' + thingName + '/shadow/update');
        });

        device.on('message', function(topic, payload) {
        //console.log('Message: ', topic, payload.toString());
        s = JSON.parse(payload.toString())['state']['reported']['payload'];
        console.log('Message: ', s)
        console.log("GG: ", payload.toString())
        // Broadcast the message to any connected socket clients
        io.emit('broadcast', {topic, message: payload.toString()});
        return s;
        
        });
    }
}