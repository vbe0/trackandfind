var mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://localhost/things');
var things_db = mongoose.connection;


// Open user database
things_db.on('error', console.error.bind(console, 'connection error:'));
things_db.once('open', function () {
  console.log("Things db connected")
});


module.exports = things_db;