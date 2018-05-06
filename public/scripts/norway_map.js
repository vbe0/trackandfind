
var map; 

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
    obj.pastmarkers = {}

    map = obj; 
}

function onMapClick() {
    console.log("Clicked map")
}

function removeMarkers()
{
    for (marker in map.markers) {
        map.map.removeLayer(map.markers[marker]);
    }
}

function addAllMarkers(){
    for (marker in map.markers) {
        map.markers[marker].addTo(map.map)
    }
}

function addMarker(markerName, lat, lng, markerText="", time=getDateTime())
{
    var label = "<b>" + markerName + "</b>" + "<br>" + markerText + "<br>. " + time
    removeMarker(markerName)
    // if (markerName in map.markers) {
        //     var newLatLng = new L.LatLng(lat, lng)
        //     //console.log("lat:", lat, "lng: ", lng)
        //     map.markers[markerName].setLatLng(newLatLng)
        //     map.popups[markerName] = label
        //     map.markers[markerName].bindPopup(map.popups[markerName])        
        // }
        // else {
            map.markers[markerName] = L.marker([lat, lng]);
            //console.log("Adding: ", markerName)
            map.popups[markerName] =  label 
            map.markers[markerName].bindPopup(map.popups[markerName])
            map.markers[markerName].addTo(map.map)
        //}

}

function addPastMarker(markerName, lat, lng, markerText="", time=getDateTime())
{
    var label = "<b>" + markerName + "</b>" + "<br>" + markerText + "<br>. " + time

    var circle = L.circle([lat, lng], {
        color: 'blue',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 200
    })
    map.pastmarkers[markerName] = circle
    map.popups[markerName] = label
    map.pastmarkers[markerName].bindPopup(map.popups[markerName])        
    map.pastmarkers[markerName].addTo(map.map)
}

function removeMarker(markerName)
{   
    if (markerName in map.markers) {
        map.map.removeLayer(map.markers[markerName]);
    }
    if (markerName in map.pastmarkers) {
        map.map.removeLayer(map.pastmarkers[markerName]);
    }
}
function addMarkerWithId(markerName)
{
    if (markerName in map.markers) {
        map.markers[markerName].addTo(map.map)
    }
    else if (markerName in map.pastmarkers) {
        map.pastmarkers[markerName].addTo(map.map)
        
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

