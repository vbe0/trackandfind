



function getSensorData() 
{
    // //var socket = io("ws://trackandfind.azurewebsites.net", {transports: ['websocket']});
    var socket = io('http://localhost:3000', {transports: ['websocket']});
    console.log("listening")
    //var socket = require('socket.io-client').connect()
    socket.on('livemap', function(data) {
        //var payload = JSON.parse(data);
        console.log("payload: ", data.topic)
        addToMap(data)
    });
}


addToMap = function (data) {
    console.log("gg ", data)
}