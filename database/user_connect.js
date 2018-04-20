
const mongoose = require("mongoose");

const dbURI =
"mongodb://vbe:gg@clusteriot-shard-00-00-omyrb.mongodb.net:27017,clusteriot-shard-00-01-omyrb.mongodb.net:27017,clusteriot-shard-00-02-omyrb.mongodb.net:27017/test?ssl=true&replicaSet=ClusterIOT-shard-0&authSource=admin"

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


var user_db = mongoose.connection;


// Open user database
user_db.on('error', console.error.bind(console, 'connection error:'));
user_db.once('open', function () {
  console.log("User db connected")
});


module.exports = user_db;