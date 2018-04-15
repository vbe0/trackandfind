
var map; 
//listen()

function initMap()
{
    var obj = {};
    obj.map = L.map('map').setView([69.6815037, 18.9772839], 8);
    //L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
    L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}', {
        attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(obj.map);
    obj.map.on('click', onMapClick);

    obj.markers = {};
    obj.popups = {};

    map = obj; 
}

function onMapClick(markerName, lat, lng) {
    var newLatLng = new L.LatLng(lat, lng)
    map.markers[markerName].setLatLng(newLatLng)
}

function removeMarkers()
{
    for (marker in map.markers) {
        map.map.removeLayer(map.markers[marker]);
    }
}

function addMarker(markerName, lat, lng)
{
    if (markerName in map.markers) {
        var newLatLng = new L.LatLng(lat, lng)
        //console.log("lat:", lat, "lng: ", lng)
        map.markers[markerName].setLatLng(newLatLng)
        map.popups[markerName] = "<b>" + markerName + "</b>" + "<br>Updated:" + getDateTime()
        map.markers[markerName].bindPopup(map.popups[markerName])        
    }
    else {
        map.markers[markerName] = L.marker([lat, lng]);
        //console.log("Adding: ", markerName)
        map.popups[markerName] = "<b>" + markerName + "</b>" + "<br>Updated:" + getDateTime()
        map.markers[markerName].bindPopup(map.popups[markerName])
        map.markers[markerName].addTo(map.map)
    }
}

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

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute;   
     return dateTime;
}

