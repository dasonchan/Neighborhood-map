var map;

// Markers array
var markers = [
    {
        title: "Regal Winter Park Village Stadium 20 & RPX",
        lat: 28.60194,
        lng: -81.36188
    },
    {
        title: "Ruth's Chris Steak House",
        lat: 28.60361,
        lng: -81.36388
    }

];

// initiate google map
function initMap() {
    var myLatLng =  {lat: 28.60188, lng: -81.36318};

    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 18,
        center: myLatLng
    })

    // Create a marker and set its position.
    var center = new google.maps.Marker({
      map: map,
      position: myLatLng,
      title: 'Winter Park Village'
    });

    ko.applyBindings(new viewModel());
}

/*
    Return an URL to a Foursqaure query that returns the venue ID
    and data. Takes latitude, longitude, and name of venues

*/
function foursquareQuery(lat, lng, name){
    var client_id = "2IUNCOTIR2UY5IBWIVK3YK3KX52LLTMUQO4UZF5SKQI0OV2I";
    var client_secret = "IJQHBFGENYEJ3C2BZXXRDYDJZGCPEGSFFGAAJRABKOSEISSY";

    var query = "https://api.foursquare.com/v2/venues/search?client_id="
                + client_id + "&client_secret="
                + client_secret
                + "&ll=" + lat + "," + lng
                + "&query=" + encodeURIComponent(name)
                + "&v=20160908&limit=1";
    return query;
}

var infowindowDefault = '<div style="width: 100px; height: 30px;"><p style="text-align: center;">Loading</p></div>';

var viewModel = function() {
    var self = this;

    self.locationList = ko.observableArray([]);

    markers.forEach(function(marker){
        self.locationList.push(new loc(marker));
    });

    self.infowindow = new google.maps.InfoWindow({
        content: infowindowDefault
    });

    self.infowindowOutput = function(location) {
        self.infowindow.setContent(infowindowDefault);
        self.getFoursquareData(location);
    }


    /*
        Download Foursqaure data asynchronously using ajax
    */
    self.getFoursquareData = function(venue) {
            var url = foursquareQuery(venue.lat, venue.lng, venue.title);

            $.getJSON(url)
                .done(function(data) {
                    console.log("successfully downloaded foursquare data");
                    var result = data.response.venues["0"];
                    var output = result.name + "<hr>" + result.id;
                    self.infowindow.setContent(output);
            })
            .fail(function(){
                console.log("Error occurs while getting foursquare data");
            })
    };

    // iterate through locationList ko observable array
    self.locationList().forEach(function(location){
        // add event listener for 'click' to each location.marker then we pass location to the return function, then run it right after with location as parameter
        location.marker.addListener('click', (function(){
            return function(){
                self.infowindowOutput(location);
                self.infowindow.open(map,location.marker);
            }
        })(location));
        // add event listener for 'closeclick' to each infowindow then we pass location to the return function, then run it right after with location as parameter
        google.maps.event.addListener(self.infowindow, 'closeclick', (function(){
            return function(){
                // reset all other markers to default red
                for (var j = 0; j < locations.length; j++) {
                    self.locationList()[j].marker.setIcon("https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png");
                }
            }
        })(location))
    });
};




var loc = function(marker){
    var self = this;
    self.title = ko.observable(marker.title);
    self.lat = marker.lat;
    self.lng = marker.lng;


    self.marker = new google.maps.Marker({
        position: {lat: self.lat, lng: self.lng},
        map: map
    })

    self.showMarker = function(map) {
        if (map !== null && self.marker.map === null){
            self.marker.setMap(map);
        }
        else{
            self.marker.setMap(null);
        }
    };
}





