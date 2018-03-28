var kk = require('mongoose');

//connect to MongoDB
kk.connect('mongodb://localhost/users');
var user_db = kk.connection;


// Open user database
user_db.on('error', console.error.bind(console, 'connection error:'));
user_db.once('open', function () {
  console.log("User db connected")
});


module.exports = user_db;