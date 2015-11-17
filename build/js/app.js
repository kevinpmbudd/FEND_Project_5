'use strict';
var map,
    loadMarkers,
    refreshMarkers;

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
            lat: 34.0,
            lng: -118.25
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


var renderMarkers = function( locations ) {
    var data;

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

    for (var i = 0; locations.length; i ++) {

        data = locations[i];

        // console.log(data);

        // this.lat = ko.observable(data.lat);
        // this.lng = ko.observable(data.lng);
        // this.title = ko.observable(data.title);

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
            infowindow.open(map,marker);
        });

        markers.push(marker);
    }
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
    // console.log(filteredLocations);

    for (var i = 0; i < markers.length; i++) {


        for (var j = 0; j < filteredLocations.length; j++) {
            var filteredMark = filteredLocations[j];
            console.log(filteredMark.title);
            // console.log(markers[i]);
            if (filteredMark.title == markers[i].title) {
                markers[i].setVisible(true);
                break;
            }
            else
                markers[i].setVisible(false);
        }
    }
};

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
    	return false;
    return string.substring(0, startsWith.length) === startsWith;
};

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
        // console.log(location.title);
    };

    loadMarkers = function () {
        renderMarkers(self.search());
    };

    refreshMarkers = function () {
        setVisibilty(self.search());
    };

};

ko.applyBindings(new ViewModel());

$(document).ready(function() {
    loadMarkers();
});

// $('#search-box').keypress(function () {
//     // deleteMarkers();
//     // loadMarkers();
//     refreshMarkers();
// });