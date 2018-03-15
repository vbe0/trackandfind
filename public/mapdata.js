console.log("YOLO");

var map = L.map('map').setView([69.6815037, 18.9772839], 8);
L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
    attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }
).addTo(map);

map.on('click', clear)

var marker = L.marker([69.48037, 18.9772839]).addTo(map);
marker.on('click', plotpoints)

var myIcon = L.icon({
    iconUrl: '../../images/sheep2.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

function plotpoints(e) {
    var polygon = L.polygon([
    [69.48037, 18.9772839],
    [69.581537, 20.9772839],
    [69.881412, 18.9772839]
    ]).addTo(map);    
}

function clear(e) {
    map.closePopup();
    }