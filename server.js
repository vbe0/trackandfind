'use strict';


// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var routes = require('./routes/index.js');
var tools = require('./data/sensordata.js');
var Worker = require('webworker-threads').Worker;

var port = process.env.PORT || 8080;
var worker = new Worker("./data/sql_base.js");
var app = express();



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

tools.getSensorData(worker);


