
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
        var lat = Number(data.message.lat)
        var lng = Number(data.message.lng)
        var battery = data.message.battery
        var temp = data.message.temperature
        var topic = data.topic.split("/")
        var thing = topic.last()

        if (lat == NaN || lng == NaN) {
            console.log ("Received data without coordinates from ", thing, ". Data:", data)
        }

        addMarker(thing, lat, lng, markerText="Temperature: " + temp + "Battery: "+ battery)
    }
    catch (err) {
        console.log("Error parsing data from tracker: ", thing, err)
    }
}


