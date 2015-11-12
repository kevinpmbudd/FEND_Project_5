var map;

//data model of locations
var locations = [{
    lat: 34.00,
    lng: -118.25,
    title: 'Intelligentsia - Silverlake'
}, {
    lat: 34.01,
    lng: -118.25,
    title: 'Intelligentsia - Venice'
}, {
    lat: 34.02,
    lng: -118.25,
    title: 'Espresso Cielo'
}, {
    lat: 34.03,
    lng: -118.25,
    title: 'Blue Bottle Coffee'
}, {
    lat: 34.04,
    lng: -118.25,
    title: 'Intelligentsia - Pasadena'
}];

var initMap = function() {
	  // var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.0,
            lng: -118.25
        },
        zoom: 11
    });

    // locations.forEach(function (location) {
    // 	Marker(location);
    // });
		for (i = 0; i < ViewModel.locationList().length; i++) {
			location = ViewModel.locationList()[i];

			Marker( location );
		}
};

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
        title: this.title()
    });
};


var ViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);

    locations.forEach(function(location) {
        self.locationList.push( location );
    });

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.locationPicker = function(location) {
        self.currentLocation(location);
    };

    this.listviewClick = function(location) {
        console.log(location.title);
    };

};

ko.applyBindings(new ViewModel());