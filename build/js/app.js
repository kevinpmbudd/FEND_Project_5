// var googleAPIKey = AIzaSyBqKk_buo1F45vURvpqTQqZz4JyopNL9hQ;

var locations = [
	{
		position: {lat: 34.0, lng: -118.25},
    // map: map,
    title: 'Intelligentsia - Silverlake'
	},
	{
		position: {lat: 34.1, lng: -118.25},
    // map: map,
    title: 'Intelligentsia - Venice'
	},
	{
		position: {lat: 34.2, lng: -118.25},
    // map: map,
    title: 'Espresso Cielo'
	},
	{
		position: {lat: 34.3, lng: -118.25},
    // map: map,
    title: 'Blue Bottle Coffee'
	},
	{
		position: {lat: 34.4, lng: -118.25},
    // map: map,
    title: 'Intelligentsia - Pasadena'
	}
	];

var initMap = function() {

	var map;

	map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 34.0, lng: -118.25},
				zoom: 11
	});
};

// var Marker = function(data) {
// 	var self = this;

// 	this.position = ko.observable(data.position);
// 	this.map = ko.observable(data.map);
// 	this.title = ko.observable(data.title);

// 	var marker = new google.maps.Marker( {
// 		position: new google.maps.LatLng(self.position.lat, self.position.lng),
// 		map: self.map,
// 		title: self.title
// 	});
// }

// ko.bindingHandlers.googlemap = {
// 	init: function (element, valueAccessor) {
// 		var
// 		value = valueAccessor(),
// 		mapOptions = {
// 			zoom: 10,
// 			center: new google.maps.LatLng(value.centerLat, value.centerLon),
// 			mapTypeId: google.maps.MapTypeId.ROADMAP
// 		},
// 		map = new google.maps.Map(element, mapOptions);

// 		for (var l in value.locations())
// 		{
// 			var latLng = new google.maps.LatLng(
// 				value.locations()[l].position.lat,
// 				value.locations()[l].position.lng);
// 			var marker = new google.maps.Marker({
// 				position: latLng,
// 				map: map
// 			});
// 		}
// 	}
// };

var ViewModel = function() {
	var self = this;

	this.locationList = ko.observableArray([]);

	locations.forEach(function(item) {
		self.locationList.push( item );
	});

	// var map;

	// map = new google.maps.Map(document.getElementById('map'), {
	// 			center: {lat: 34.0, lng: -118.25},
	// 			zoom: 11
	// });

	// locationList = ko.observableArray([]);

	// locations.forEach(function(item) {
	// locationList.push( new Marker(item) );
	// });

};

ko.applyBindings(new ViewModel());