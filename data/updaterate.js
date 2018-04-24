
var Promise = require('bluebird');  
var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;
var url = "mongodb://vbe:gg@clusteriot-shard-00-00-omyrb.mongodb.net:27017,clusteriot-shard-00-01-omyrb.mongodb.net:27017,clusteriot-shard-00-02-omyrb.mongodb.net:27017/test?ssl=true&replicaSet=ClusterIOT-shard-0&authSource=admin"


var getRate = function (name) {
    return mongoClient.connectAsync(url)
        .then(function(db) {
            return db.collection('updaterates').findAsync({name:name})
        })
        .then(function(cursor) {
           return cursor.toArrayAsync();
        })
        .then(function(content) {
            // This is how we return the data to the next .then() call
            //console.log("UPDATERATES value: ", content[0].value)
            return content[0];
        })
        .catch(function(err) {
           throw err;
        });
};

var updateRate = function (name, value) {
    console.log("Value: ", value)
    var myobj = { name: name, value: value };
    return mongoClient.connectAsync(url)
    .then(function(db) {
        return db.collection('updaterates').update({name:name}, myobj, {upsert: true})
    })
    .then(function() {
        // This is how we return the data to the next .then() call
        var status = "Rate updated: " + myobj.name + myobj.value
        return status;
    })
    .catch(function(err) {
       throw err;
    });
};

module.exports = {
    fetchRate: function (params) {
        return getRate(params)
    },
    updateRate: function (name, value) {
        return updateRate(name, value)
    }
}