

function listen() 
{
    //var socket = io("ws://trackandfind.azurewebsites.net", {transports: ['websocket']});
    var socket = io('http://localhost:3000', {transports: ['websocket']});
    
    socket.on('broadcast', function(data) {
        var payload = JSON.parse(data.message);
        var grids = payload.latlng.split(",") 
        addMarker("Coolsheep", grids[0], grids[1])
    });
}