var map;
var markersArray = [];


/*function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzpmxGazNZ1b9gkIdbd6W-jjDPdHQ7ckw";
    document.body.appendChild(script);
}
window.onload = loadScript;*/

/*function initMap() {

    // Create a map object and specify the DOM element for display.


    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: center,
      title: 'Winter Park Village'
    });


    // Set up markers
    //setMarkers(markers);

    // Check visiblity of markers
    checkVisibility();
    remoteDataHelper.getData(markers);


}*/

// Set markers function that will be used to initiatte the map
/*function setMarkers(location) {
    for (i = 0; i < location.length; i++) {
        location[i].marker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].lat, location[i].lng),
            map: map,
            title: location[i].title
        });

        var addr;
        for (j = 0; i < location[i].address().length; j++){
            addr += location[i].address()[j] + ", ";
        }

        location[i].content = location[i].title + "<hr>" + addr;
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
}*/

function makeAddress(location){
    var addr;
    for (i = 0; i < location.address().length; i++){
        addr += location.address[i] + ", ";
    }
    return addr;
}

function checkVisibility() {
    for (i = 0; i < markers.length; i++){
        if (markers[i].bool === true) {
            markers[i].marker.setMap(map);
        }
        else {
            markers[i].marker.setMap(null);
        }
    }
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
                + "&v=20140806";
    return query;
}

// var remoteDataHelper = {
//     gettingFoursquareData: false,
//     /*
//         Return true if it is getting Foursquare Data
//     */
//     isGettingData: function(){
//         return this.gettingFoursquareData;
//     },

//     /*
//         Starts and manages the process for getting venue data
//         from foursquare.
//     */
//     getData: function() {
//         for (i = 0; i < markers.length; i++){
//             console.log("Get remote data");
//             if (markers[i].foursquareid() === null){
//                 this.getFoursqaureData(markers[i]);
//             }
//         }
//     },

//     /*
//         Download Foursqaure data asynchronously using ajax
//     */
//     getFoursqaureData: function(venue) {
//         var self = this;
//         if (!self.gettingFoursquareData) {
//             self.gettingFoursquareData = true;
//             $.ajax({
//                 dataType: "json",
//                 url: foursquareQuery(venue.lat, venue.lng, venue.title),
//                 success: function(data) {
//                     console.log("successfully downloaded foursquare data");
//                     var addr, result, category;
//                     result = data.response.venues[0];
//                     if (venue.address.length === 0) {
//                         for(addr in result.location.formattedAddress) {
//                             venue.address.push(result.location.formattedAddress[addr]);
//                         }
//                     }
//                     if (venue.category.length === 0) {
//                         for(category in result.categories.name) {
//                             venue.category.push(result.categories.name[category]);
//                         }
//                     }
//                     venue.foursquareid(result.id);
//                     self.gettingFoursquareData = false;
//                 },
//                 error: function() {
//                     console.log("Error occurs while getting foursquare data");
//                     self.gettingFoursquareData = false;
//                 }
//             })
//         }
//     }
// }; // Remote data helper

var viewModel = function(map, markers) {
    var self = this;

    self.infowindow = new google.maps.InfoWindow({
        content: null,
    });


    this.gettingFoursquareData = false;
    /*
        Return true if it is getting Foursquare Data
    */
    this.isGettingData = function(){
        return this.gettingFoursquareData;
    },

    /*
        Starts and manages the process for getting venue data
        from foursquare.
    */
    this.getData = function() {
        for (i = 0; i < markers.length; i++){
            console.log("Get remote data");
            if (markers[i].foursquareid() === null){
                this.getFoursqaureData(markers[i]);
            }
        }
    },

    /*
        Download Foursqaure data asynchronously using ajax
    */
    self.getFoursqaureData = function(venue) {
        var settings = {
            dataType: "json",
            url: foursquareQuery(venue.lat, venue.lng, venue.title),

            error: function(){
                console.log("Error occurs while getting foursquare data");
            },

            success: function(data) {
                console.log("successfully downloaded foursquare data");
                var result;
                result = data.response.venues[0];
                var output = result.name + " " + result.location.formattedAddress;
                self.infowindow.setContent(output);
            }
        };
        $.ajax(settings);
    };

    self.getData();

    self.googleMap = map;

    var center = new google.maps.Marker({
      map: map,
      position: {lat: 28.60188, lng: -81.36318},
      title: 'Winter Park Village'
    });


    self.locations = [];
    markers.forEach(function(place){
        self.locations.push(new Place(place));
    });

    self.locations.forEach(function(place) {
        var latLng = {lat: place.lat, lng: place.lng};
        var markerOptions = {
            map: self.googleMap,
            position: latLng,
            title: place.title,
            animation: google.maps.Animation.DROP,
        };

        place.marker = new google.maps.Marker(markerOptions);
        var content = place.title + "<hr>" + place.address[0];
        var infowindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(place.marker, 'click', function() {
            {
              infowindow.setContent(content);
              infowindow.open(map, this);
            }
        });
    });

    function Place(dataObj) {
        this.title = dataObj.title;
        this.lat = dataObj.lat;
        this.lng = dataObj.lng;
        this.address = dataObj.address;
        this.marker = null;
    }

};


function createMap(){
    return new google.maps.Map(document.getElementById('map'), {
      center: {lat: 28.60188, lng: -81.36318},
      scrollwheel: false,
      zoom: 18
    });
}

google.maps.event.addDomListener(window, 'load', function(){
    var googleMap = createMap();
    ko.applyBindings(new viewModel(googleMap, markers));
});

// Markers array
var markers = [
    {
        title: "Regal Winter Park Village Stadium 20 & RPX",
        lat: 28.60194,
        lng: -81.36188,
        address: ko.observableArray([]),
        category: ko.observable(null),
        visible: ko.observable(true),
        bool: true,
        foursquareid: ko.observable(null)
    },
    {
        title: "Ruth's Chris Steak House",
        lat: 28.60361,
        lng: -81.36388,
        address: ko.observableArray(null),
        category: ko.observable(null),
        visible: ko.observable(true),
        bool: true,
        foursquareid: ko.observable(null)
    }

];

