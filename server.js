var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//var things_db = require('./thing_connect.js')
var user_db = require('./database/user_connect.js')
var favicon = require('serve-favicon')
var path = require('path')



// View engine we use for rendering
app.set('view engine', 'ejs');


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
//app.use('/public', express.static(process.cwd() + '/public'));
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

console.log("Gets here 1")
// Routing
var routes = require('./routes/router');
app.use('/', routes);

console.log("Gets here 2")

// 404 errors if requesting for non-existing files
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

console.log("Gets here 3")

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
console.log("Gets here 4")


// listen on port 3000
app.listen(8080, function () {
  console.log('Express app listening on port 3000');
});