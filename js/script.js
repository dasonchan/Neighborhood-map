var map;
var markersArray = [];

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzpmxGazNZ1b9gkIdbd6W-jjDPdHQ7ckw&callback=initMap";
    document.body.appendChild(script);
}
window.onload = loadScript;

function initMap() {
    var center = {lat: 28.60188, lng: -81.36318};

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      scrollwheel: false,
      zoom: 18
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: center,
      title: 'Winter Park Village'
    });

    // Set up markers and infowindows
    var infowindow = new google.maps.InfoWindow();
    var m, i, content;

    for (i = 0; i < markers.length; i++) {
      m = new google.maps.Marker({
        position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
        map: map,
        title: markers[i].title
      });

      content = markers[i].title + "<hr>" + markers[i].category;

      google.maps.event.addListener(m, 'click', (function(m, i) {
        return function() {
          infowindow.setContent(content);
          infowindow.open(map, m);
        }
      })(m, i));
    }


}


var markers = [
    {
        title: "Regal Winter Park Village Stadium 20 & RPX",
        lat: 28.60194,
        lng: -81.36188,
        streetStr: "510 N Orlando Ave",
        cityStr: "Winter Park, FL",
        category: "Entertainment",
        visible: ko.observable(true)
    },
    {
        title: "Ruth's Chris Steak House",
        lat: 28.60361,
        lng: -81.36388,
        streetStr: "610 N Orlando Ave",
        cityStr: 'Winter Park, FL',
        category: 'Restaurant',
        visible: ko.observable(true)
    }

];

