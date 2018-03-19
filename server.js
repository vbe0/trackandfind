'use strict';


// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var routes = require('./routes/index.js');
var tools = require('./data/sensordata.js');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
io = require('socket.io')(3000);
var port = process.env.PORT || 8080;


// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');



var awsIot = require('aws-iot-device-sdk');

var thingName = '00001319'; // Replace with your own thing name

var fs = require("fs");

var device = awsIot.device({
   keyPath: './certs/privkey.pem',
  certPath: './certs/cert.pem',
    caPath: './certs/ca.pem',
  clientId: thingName,
      host: 'a31ovqfkmg1ev8.iot.eu-west-1.amazonaws.com'
});



// ================================================================
// setup routes
// ================================================================
routes(app);

// ================================================================
// start our server
// ================================================================
app.listen(port, function() {
    console.log('Server listening on port ' + port + '...');
});

//tools.getSensorData(io);
