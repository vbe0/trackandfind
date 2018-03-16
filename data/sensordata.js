var awsIot = require('aws-iot-device-sdk');
var io = require('socket.io')(3000);

var thingName = '00001319'; // Replace with your own thing name
var http = require('http');
var fs = require("fs");
var device = awsIot.device({
   keyPath: './certs/privkey.pem',
  certPath: './certs/cert.pem',
    caPath: './certs/ca.pem',
  clientId: thingName,
      host: 'a31ovqfkmg1ev8.iot.eu-west-1.amazonaws.com'
});

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;  
var config = {
    userName: 'tni068', // update me
    password: 'Kake1234', // update me
    server: 'animaltest.database.windows.net', // update me
    options: {
        database: 'test_db',
        encrypt: true
    }
}

var connection = new Connection(config);

//var db = require('./sqlconnection.js');


module.exports = 
{
    getSensorData: function () {
        id = 11;
        


        // When the MQTT client connects, subscribe to the thing topic
        device.on('connect', function() {
            console.log('Client connected');
            device.subscribe('$aws/things/' + thingName + '/shadow/update');
        });

        device.on('message', function(topic, payload) {
            //console.log('Message: ', topic, payload.toString());
            s = JSON.parse(payload.toString())['state']['reported']['payload'];
            console.log('Message: ', s)


            
            //var dataPoint = {id: id, animal_id: 22, longitude: s.split(" ")[0], latitude: s.split(" ")[1], time_stamp: new Date().toLocaleString()};
            //db.db_insert();

            // Broadcast the message to any connected socket clients
            //io.emit('broadcast', {topic, message: payload.toString()});
            //return s;        
        });
        id++;

    }
}


function queryDatabase() { 
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT * from DataPoints", 
            function(err, rowCount, rows) {
                console.log(rowCount + ' row(s) returned');
                process.exit();
            }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });

    connection.execSql(request);

   }