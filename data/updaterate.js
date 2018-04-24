var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://vbe:gg@clusteriot-shard-00-00-omyrb.mongodb.net:27017,clusteriot-shard-00-01-omyrb.mongodb.net:27017,clusteriot-shard-00-02-omyrb.mongodb.net:27017/test?ssl=true&replicaSet=ClusterIOT-shard-0&authSource=admin"


var getCurrentRate = function (name) {
    var res = "nothing"
    return MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var res = dbo.collection("updaterates").findOne({}, function(err, result) {});
        console.log("RES: ", res)
        return res
      }); 
}


var updateRate = function (name, value) {
    console.log("Value: ", value)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var myobj = { name: name, value: value };
        dbo.collection("updaterates").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
        });
    });
}

module.exports = {
    fetchRate: function (params) {
        return getCurrentRate(params)
    },
    updateRate: function (name, value) {
        updateRate(name, value)
    }
}