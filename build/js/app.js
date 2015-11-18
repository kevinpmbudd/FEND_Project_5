'use strict';
var map,
    loadMarkers;

var CLIENT_ID = 'OUJ3QNUKM33CWHU4G4VIXM5IXPZLNCXWMBUSWFSSA1BQW4YT',
    CLIENT_SECRET = '42DDHVI3XBNIOB1T4QL5P3MD3HQK5YLP5XJRWEZXQB04D31C',
    foursquareURL = 'https://api.foursquare.com/v2/venues/search?client_id='
        + CLIENT_ID + ' &client_secret=' + CLIENT_SECRET + '&v=20130815&ll=34.09,-118.28&query=coffee';

var id = '49bad052f964a520b3531fe3';
var foursquarePhotosURL = 'https://api.foursquare.com/v2/venues/' + id + '/photos';

var markers = [];
//data model of locations
var locations = [{
    lat: 34.091966,
    lng: -118.279965,
    title: 'Intelligentsia - Silverlake'
}, {
    lat: 33.991111,
    lng: -118.466812,
    title: 'Intelligentsia - Venice'
}, {
    lat: 33.998110,
    lng: -118.479512,
    title: 'Espresso Cielo'
}, {
    lat: 34.038812,
    lng: -118.232656,
    title: 'Blue Bottle Coffee - Arts District'
}, {
    lat: 33.992004,
    lng: -118.470488,
    title: 'Blue Bottle Coffee - Abbot Kinney'
}, {
    lat: 34.076009,
    lng: -118.370111,
    title: 'Blue Bottle Coffee - Beverly Grove Cafe'
}, {
    lat: 34.078993,
    lng: -118.309309,
    title: 'LaB - Coffee and Roasters'
}, {
    lat: 34.145864,
    lng: -118.151678,
    title: 'Intelligentsia - Pasadena'
}];

var Location = function ( lat, lng, title ) {
	this.lat = lat;
	this.lng = lng;
	this.title = title;
};

var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.07,
            lng: -118.30
        },
        zoom: 11,
        zoomControl: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });
};

// https://api.foursquare.com/v2/venues/search
//   ?client_id=CLIENT_ID
//   &client_secret=CLIENT_SECRET
//   &v=20130815
//   &ll=40.7,-74
//   &query=sushi


var renderMarkers = function( locations ) {
    locations.forEach(function(data) {
        // data = locations[i];
        console.log(data.title);

        var contentString = '<div id="content">' + data.title + '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
            position: {
                lat: data.lat,
                lng: data.lng
            },
            map: map,
            title: data.title,
            animation: google.maps.Animation.DROP,
            visible: true
        });

        marker.addListener('click', function() {
            infowindow.open(marker.get('map'), marker);
        });

        markers.push(marker);
    });
};

// Sets the map on all markers in the array.
var setMapOnAll = function(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

var clearMarkers = function() {
  setMapOnAll(null);
};

var deleteMarkers = function() {
  clearMarkers();
  markers = [];
};

var setVisibilty = function( filteredLocations ) {
    for (var i = 0; i < markers.length; i++) {


        for (var j = 0; j < filteredLocations.length; j++) {
            var filteredMark = filteredLocations[j];
            // console.log(filteredMark.title);
            // console.log(markers[i]);
            if (filteredMark.title == markers[i].title) {
                markers[i].setVisible(true);
                break;
            }
            else
                markers[i].setVisible(false);
        }
    }

    if (filteredLocations.length == 0) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    }
};

// ko.utils.stringStartsWith = function(string, startsWith) {
//     string = string || "";
//     if (startsWith.length > string.length)
//     	return false;
//     return string.substring(0, startsWith.length) === startsWith;
// };

var ViewModel = function() {
    var self = this;

    var compare = function(a,b) {
  		if (a.title < b.title)
    		return -1;
  		if (a.title > b.title)
    		return 1;
  		return 0;
	}

	locations.sort(compare);

    self.locationList = ko.observableArray( locations );

    self.query = ko.observable('');

    self.search = ko.computed( function() {
        return ko.utils.arrayFilter(self.locationList(), function( location ) {
            return location.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
         });
    });

    self.search.subscribe(function() {
        setVisibilty(self.search());
    });

    this.listviewClick = function(location) {
        console.log(location.title);
        markers.forEach(function( marker ) {
            if (marker.title == location.title) {
                marker.setAnimation(google.maps.Animation.DROP);
            }
        });

        $.ajax({
            url: foursquarePhotosURL
        }).done(function( data ) {
            console.log( data );
        });
    };

    loadMarkers = function () {
        renderMarkers(self.search());
    };

};

ko.applyBindings(new ViewModel());

$(document).ready(function() {
    loadMarkers();
});