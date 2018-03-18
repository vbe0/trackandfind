
var map; 
listen()

function initMap()
{
    var obj = {};
    obj.map = L.map('map').setView([69.6815037, 18.9772839], 8);
    L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
        attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(obj.map);
    obj.map.on('click', onMapClick);

    obj.markers = {};

    map = obj; 
}

function onMapClick()
{

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
        console.log("lat:", lat, "lng: ", lng)
        map.markers[markerName].setLatLng(newLatLng)
    }
    else {
        map.markers[markerName] = L.marker([lat, lng]);
        console.log("Adding: ", markerName)
        var popup = "<b>" + markerName + "</b>" + "<br>I am a sheep"
        map.markers[markerName].bindPopup(popup)
        map.markers[markerName].addTo(map.map)
    }
}

function listen() 
{
    var socket = io({transports: ['websocket']});
    //var socket = io('http://localhost:3000', {transports: ['websocket']});
    
    socket.on('broadcast', function(data) {
        var payload = JSON.parse(data.message);
        var grids = payload.latlng.split(",") 
        addMarker("Coolsheep", grids[0], grids[1])
    });
}