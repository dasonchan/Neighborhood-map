var map;
var locationsArray = [];

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src= "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzpmxGazNZ1b9gkIdbd6W-jjDPdHQ7ckw&callback=initMap";
    document.body.appendChild(script);
}
window.onload = loadScript;