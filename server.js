'use strict';

// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var routes = require('./routes/index.js');
var tools = require('./data/sensordata.js');

var app = express();

var server = require('http').Server(app);
var port = process.env.PORT || 8080;

var favicon = require('serve-favicon')
var path = require('path')

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))


// ================================================================
// setup our express application
// ================================================================
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

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

tools.getSensorData();
