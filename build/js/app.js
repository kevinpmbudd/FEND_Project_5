// var googleAPIKey = AIzaSyBqKk_buo1F45vURvpqTQqZz4JyopNL9hQ;
var map;
//data model of locations
var locations = [
		{
			lat: 34.00,
			lng: -118.25,
	    title: 'Intelligentsia - Silverlake'
		},
		{
			lat: 34.01,
			lng: -118.25,
	    title: 'Intelligentsia - Venice'
		},
		{
			lat: 34.02,
			lng: -118.25,
	    title: 'Espresso Cielo'
		},
		{
			lat: 34.03,
			lng: -118.25,
	    title: 'Blue Bottle Coffee'
		},
		{
			lat: 34.04,
			lng: -118.25,
	    title: 'Intelligentsia - Pasadena'
		}
	];

var initMap = function() {

		map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: 34.0, lng: -118.25},
					zoom: 11
		});

		// var marker = new google.maps.Marker({
		// 	position: {lat: 34.0, lng: -118.25},
		// 	map: map,
		// 	title: "One"
		// });
};

var Marker = function( data ) {
	this.lng = ko.observable( data.lng );
	this.lat = ko.observable( data.lat );
	this.title = ko.observable( data.title );

	console.log( data );
	console.log( this.lng() );
	console.log( this.lat() );
	console.log( this.title() );

	marker = new google.maps.Marker({
		position: {lat: this.lat(), lng: this.lng()},
		map: map,
		title: this.title()
	});

	console.log(marker);

};


var ViewModel = function() {
	var self = this;

	this.locationList = ko.observableArray( [] );

	locations.forEach( function ( location ) {
		self.locationList.push( new Marker ( location ) );
	});

	this.currentLocation = ko.observable( this.locationList()[0] );

	this.locationPicker = function( location ) {
		self.currentLocation( location );
	}

	this.listviewClick = function ( location ) {
		console.log( location.title );
		Marker( location );
	};
};

ko.applyBindings(new ViewModel());