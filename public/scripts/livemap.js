
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};


function getSensorData() 
{
    // //var socket = io("ws://trackandfind.azurewebsites.net", {transports: ['websocket']});
    var socket = io('http://localhost:3000', {transports: ['websocket']});
    console.log("listening")
    //var socket = require('socket.io-client').connect()
    socket.on('livemap', function(data) {
        //var payload = JSON.parse(data);
        //console.log("payload: ", data.topic)
        addToMap(data)
    });
}


addToMap = function (data) {
    try {
        var msg = data.message.split(",")
        var lat = Number(msg[0])
        var lng = Number(msg[1])
        var battery = msg[2]
        var topic = data.topic.split("/")
        var thing = topic.last()
        //console.log("thing, lat, lng", thing, lat, lng)
        addMarker(thing, lat, lng, markerText="Battery: "+ battery, live=true)
    }
    catch (err) {
        console.log("Error parsing data from tracker", err)
    }
}