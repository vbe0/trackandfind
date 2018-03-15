



// function initMap() {
//     // var map_div = document.getElementById("map")
//     var map = L.map('map').setView([69.6815037, 18.9772839], 11);
//     L.tileLayer('http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
//         attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
//     }).addTo(map);
//     var marker = L.marker([69.48037, 18.9772839]).addTo(map);
//     var marker = L.marker([69.581537, 18.9772839]).addTo(map);
//     var marker = L.marker([69.881412, 18.9772839]).addTo(map);
//     var marker = L.marker([69.681444, 18.9732839]).addTo(map);
//     var polygon = L.polygon([
//     [69.48037, 18.9772839],
//     [69.581537, 20.9772839],
//     [69.881412, 18.9772839]
//     ]).addTo(map);    
//     marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// }


function plotpoints(map) 
{
    var marker = L.marker([69.48037, 18.9772839]).addTo(map);
    var marker = L.marker([69.581537, 18.9772839]).addTo(map);
    var marker = L.marker([69.881412, 18.9772839]).addTo(map);
    var marker = L.marker([69.681444, 18.9732839]).addTo(map);
    var polygon = L.polygon([
    [69.48037, 18.9772839],
    [69.581537, 20.9772839],
    [69.881412, 18.9772839]
    ]).addTo(map);    
}