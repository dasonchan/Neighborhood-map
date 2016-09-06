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

    // Set up markers
    setMarkers(markers);


}

// Set markers function that will be used to initiatte the map
function setMarkers(location) {
    for (i = 0; i < location.length; i++) {
        location[i].marker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].lat, location[i].lng),
            map: map,
            title: location[i].title
        });

        location[i].content = location[i].title + "<hr>" + location[i].category;
        var infowindow = new google.maps.InfoWindow({
            content: location[i].content
        });

        google.maps.event.addListener(location[i].marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(location[i].content);
              infowindow.open(map, this);
            }
        })(location[i].marker, i));
    }
}

function foursquareSearch(lat, lng, name){
    var client_id = 2IUNCOTIR2UY5IBWIVK3YK3KX52LLTMUQO4UZF5SKQI0OV2I;
    var client_secret = IJQHBFGENYEJ3C2BZXXRDYDJZGCPEGSFFGAAJRABKOSEISSY;
    var query = "https://api.foursquare.com/v2/venues/search?client_id="
                + client_id + "&client_secret="
                + client_secret
                + "&ll=" + lat + "," + lng
                + "&query=" + encodeURIComponent(name);
    return query;
}

// Markers array
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

