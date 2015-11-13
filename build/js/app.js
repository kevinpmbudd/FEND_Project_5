var map,
	  VM;
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
	  // var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.0,
            lng: -118.25
        },
        zoom: 11
    });

    // console.log(VM.filteredLocations());

	  renderMarkers();
};

var renderMarkers = function () {
	VM.filteredLocations().forEach(function (location) {
	    	Marker ( location );
	    });
	// console.log(VM.filteredLocations());
};

// var locationFilter = function () {
// 		this.locationList = ko.observableArray( locations );

//     this.locationList = ko.observableArray(
//     	ko.utils.arrayMap( this.locationList(), function( location ) {
//         return new Location ( location.lat, location.lng, location.title );
//     }));

//     this.titleSearch = ko.observable('');

//     this.filteredLocations = ko.computed( function () {
//     	return ko.utils.arrayFilter(self.locationList(), function( location ) {
//     		return (self.titleSearch().length == 0 ||
//     			ko.utils.stringStartsWith ( location.title.toLowerCase(), self.titleSearch().toLowerCase()))
//     	});
//     });

//     return this.filteredLocations();
// }

var Marker = function( data ) {
		var self = this;

    this.lng = ko.observable(data.lng);
    this.lat = ko.observable(data.lat);
    this.title = ko.observable(data.title);

    var marker = new google.maps.Marker({
        position: {
            lat: this.lat(),
            lng: this.lng()
        },
        map: map,
        title: this.title(),
        visible: true
    });
};

var compare = function(a,b) {
		if (a.title < b.title)
  		return -1;
		if (a.title > b.title)
  		return 1;
		return 0;
};

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

var ViewModel = function() {
    var self = this;

		locations.sort(compare);

    self.locationList = ko.observableArray( locations );

    self.locationList = ko.observableArray(
    	ko.utils.arrayMap( this.locationList(), function( location ) {
        return new Location ( location.lat, location.lng, location.title );
    }));

    self.titleSearch = ko.observable('');

    self.filteredLocations = ko.computed( function () {
    	return ko.utils.arrayFilter(self.locationList(), function( location ) {
    		return (self.titleSearch().length == 0 ||
    			ko.utils.stringStartsWith ( location.title.toLowerCase(), self.titleSearch().toLowerCase()))
    	});
    });

    self.currentLocation = ko.observable(this.locationList()[0]);

    self.locationPicker = function(location) {
        self.currentLocation(location);
    };

    self.listviewClick = function(location) {
        // console.log(self.filteredLocations());
    };

    self.updateMarkers = function() {
    	renderMarkers();
    	return true;
    };
};

VM = new ViewModel();

ko.applyBindings(VM);