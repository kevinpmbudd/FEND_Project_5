// var googleAPIKey = AIzaSyBqKk_buo1F45vURvpqTQqZz4JyopNL9hQ;

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

var Map = {

	init: function() {
		var map;
		this.renderMap();
	},

	renderMap: function() {

		this.map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: 34.0, lng: -118.25},
					zoom: 11
		});

	},

	renderMarkers: function( location ) {
		this.latitude = ko.observable(location.lat);
		this.longitude = ko.observable(location.lng);
		this.markerTitle = ko.observable(location.title);

		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(latitude, longitude),
			title: markerTitle,
			map: map
		});
	}

};


var ViewModel = function() {
	var self = this;

	this.locationList = ko.observableArray( [] );

	locations.forEach(function( item ) {
		self.locationList.push( item );

	});

	this.listviewClick = function ( location ) {
		console.log( location.title );
	}
};

ko.applyBindings(new ViewModel());