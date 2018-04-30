
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};


function getSensorData() 
{   
    var host = location.origin.replace('http', 'ws')
    console.log(host)
    var ws = new WebSocket(host);

    ws.onmessage = function (event) {
      data = JSON.parse(event.data);
        //console.log("Data: ", data)
        addToMap(data)
    };

}

addToMap = function (data) {
    try {
        var msg = data.message.split(",")
        var lat = Number(msg[0])
        var lng = Number(msg[1])
        var battery = msg[2]
        var topic = data.topic.split("/")
        var thing = topic.last()
        console.log("thing, lat, lng", thing, lat, lng)
        addMarker(thing, lat, lng, markerText="Battery: "+ battery, live=true)
    }
    catch (err) {
        console.log("Error parsing data from tracker", err)
    }
}