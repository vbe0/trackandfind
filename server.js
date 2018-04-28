var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//var things_db = require('./thing_connect.js')
var user_db = require('./database/user_connect.js')
var favicon = require('serve-favicon')
var path = require('path')
var getSensorData = require('./data/cognito.js')



// View engine we use for rendering
app.set('view engine', 'ejs');
app.set('view enging', 'pug')

app.set('title', 'Track and Find')

// app.set('views', path.join(__dirname, 'views'))

// Session cookies
app.use(session({
  secret: 'yolo swag',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: user_db
  })
}));

// Parse requests coming from client(s)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Static files from template
app.use(express.static(__dirname + '/loginTemplate'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// Routing
var routes = require('./routes/router');
app.use('/', routes);


// 404 errors if requesting for non-existing files
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
var server = require('http').createServer(app)
port = process.env.PORT || 3000; 
// app.listen(port, function () {
//   console.log('Express app listening on port ', port);
// });

server.listen(port, function(){
  console.log("Server listenting on port: ", port)
})

getSensorData.getSensorData(server)

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//   next();
// });