'use strict';
////////////////////////////////////////////////////////////////////
////  GLOBAL VARIABLES ////////////////////////////////////////////
var map,
    infowindow,
    markers = [];

////////////////////////////////////////////////////////////////////
////  DATA MODEL  /////////////////////////////////////////////////
///
// # Store each location to be featured on the map as an object in
//      in the locations array.
var locations = [{
    lat: 33.992004,
    lng: -118.470488,
    title: 'Blue Bottle Coffee - Abbot Kinney',
    yelpID: 'blue-bottle-los-angeles-3',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 34.038812,
    lng: -118.232656,
    title: 'Blue Bottle Coffee - Arts District',
    yelpID: 'blue-bottle-coffee-los-angeles-12',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 34.076009,
    lng: -118.370111,
    title: 'Blue Bottle Coffee - Beverly Grove Cafe',
    yelpID: 'blue-bottle-coffee-los-angeles-14',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 33.998110,
    lng: -118.479512,
    title: 'Espresso Cielo',
    yelpID: 'espresso-cielo-santa-monica',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 34.078993,
    lng: -118.309309,
    title: 'LaB - Coffee and Roasters',
    yelpID: 'lab-coffee-and-roasters-los-angeles',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 34.145864,
    lng: -118.151678,
    title: 'Intelligentsia - Pasadena',
    yelpID: 'intelligentsia-coffee-pasadena',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 34.091966,
    lng: -118.279965,
    title: 'Intelligentsia - Silverlake',
    yelpID: 'intelligentsia-coffee-los-angeles-4',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 33.991111,
    lng: -118.466812,
    title: 'Intelligentsia - Venice',
    yelpID: 'intelligentsia-coffee-venice',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}];

////////////////////////////////////////////////////////////////////
////  MAP INITIALIZATION  /////////////////////////////////////////
///
// # Instantiate the google map with correct coordinates.
// # Instantiate the single infowindow to be re-used by each marker.
var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.07,
            lng: -118.30
        },
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    infowindow = new google.maps.InfoWindow();
};

////////////////////////////////////////////////////////////////////
////  MAP MARKERS INITIALIZATION  /////////////////////////////////
///
// # Each location is passed in to build its map marker.
// # Create a content string with data sourced from Yelp API.
// # Instantiate a new marker for each location
// # Add click listener for each marker to open its infowindow
// # Store each marker in markers array as well as in locations array
var initMarker = function(location) {

    var contentString = '<div>' + location.title + '<br> Yelp Rating: <img src="' + location.yelpRatingImg + '">' + '<br>' +
        location.yelpRating + ' stars<br>Number of Reviews: ' + location.yelpReviewCount + '</div>';

    var marker = new google.maps.Marker({
        position: {
            lat: location.lat,
            lng: location.lng
        },
        map: map,
        title: location.title,
        animation: google.maps.Animation.DROP,
        visible: true
    });

    marker.addListener('click', function() {
        infowindow.setContent(contentString);
        infowindow.open(marker.get('map'), marker);
    });

    location.marker = marker;
    markers.push(marker);
};

////////////////////////////////////////////////////////////////////
////  YELP API  ///////////////////////////////////////////////////
//
// # Store constants to generate OAUTH encoded signature.
// # Use $.ajax to and its done function to retrieve Yelp data for
//      each location.
var yelp = function(location) {

    var YELP_CONSUMER_KEY = 'Q9ytXgv7OcR2aC2HYDsGPg',
        YELP_CONSUMER_SECRET = 'MlUPkhWTf-2ar9ZWhnNlRb1PDZg',
        YELP_TOKEN = 'KdkGSp3vHhxzajyR2sNfkpY15m53MaSV',
        YELP_TOKEN_SECRET = 'fUufpxoSWMiwutlBmKs9x5_ck8o',
        YELP_ROOT_URL = 'https://api.yelp.com/v2/business/';

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = YELP_ROOT_URL + location.yelpID;

    var parameters = {
        oauth_consumer_key: YELP_CONSUMER_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb'
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_CONSUMER_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        fail: function() {
            location.yelpRating = "Yelp rating not currently available";
            location.yelpReviewCount = "Review count not currently available";
            location.yelpRatingImg = "./img/coffee.png";
            initMarker(location);
        }
    };

    $.ajax(settings)
    .done(function(data) {
        location.yelpRating = data.rating;
        location.yelpReviewCount = data.review_count;
        location.yelpRatingImg = data.rating_img_url;
        initMarker(location);
    })
    .fail(function() {
        location.yelpRating = "Yelp rating not currently available";
        location.yelpReviewCount = "Review count not currently available";
        location.yelpRatingImg = "./img/coffee.png";
        initMarker(location);
    });
};

////////////////////////////////////////////////////////////////////
////  SET THE MARKERS VISIBILITY  /////////////////////////////////
//
// # Recieve filtered array of locations.
// # Cross reference filtered arrray with all inclusive locations arrary.
// # Set visible to true for locations in the filtered array and
//      all other locations to false.
var setVisibilty = function(filteredLocations) {
    for (var i = 0; i < markers.length; i++) {
        for (var j = 0; j < filteredLocations.length; j++) {
            var filteredMark = filteredLocations[j];
            if (filteredMark.title === markers[i].title) {
                markers[i].setVisible(true);
                break;
            } else {
                markers[i].setVisible(false);
            }
        }
    }
};

////////////////////////////////////////////////////////////////////
////  KNOCKOUT VIEW MODEL /////////////////////////////////////////
//
// # Recieve filtered array of locations.
// # Cross reference filtered arrray with all inclusive locations arrary.
// # Set visible to true for locations in the filtered array and
//      all other locations to false.
var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray(locations);

    self.query = ko.observable('');

    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.locationList(), function(location) {
            return location.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    self.search.subscribe(function() {
        setVisibilty(self.search());
    });

    this.listviewClick = function(location) {
        location.marker.setAnimation(google.maps.Animation.DROP);
        google.maps.event.trigger(location.marker, 'click');
    };
};

var loadYelp = function() {
    locations.forEach(function(location) {
        yelp(location);
    });
};

ko.applyBindings(new ViewModel());

$(document).ready(function() {
    loadYelp();
});