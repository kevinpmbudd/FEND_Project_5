'use strict';
var map,
    loadMarkers;

var markers = [];
//data model of locations
var locations = [{
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
    lat: 34.038812,
    lng: -118.232656,
    title: 'Blue Bottle Coffee - Arts District',
    yelpID: 'blue-bottle-coffee-los-angeles-12',
    yelpRatingImg: null,
    yelpRating: null,
    yelpReviewCount: null,
    marker: null
}, {
    lat: 33.992004,
    lng: -118.470488,
    title: 'Blue Bottle Coffee - Abbot Kinney',
    yelpID: 'blue-bottle-los-angeles-3',
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
}];

var initMap = function() {
    loadYelp();

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

var renderMarker = function( location ) {

    var contentString = '<div>' + location.title + '<br> Yelp Rating: <img src="' + location.yelpRatingImg + '">' + '<br>' +
      location.yelpRating + ' stars<br>Number of Reviews: ' + location.yelpReviewCount +'</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

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
        infowindow.open(marker.get('map'), marker);
    });

    location.marker = marker;

};

////////////////////////////////////////////////////////////////////
////  YELP API  ///////////////////////////////////////////////////
var yelp = function( location ) {

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
          oauth_timestamp: Math.floor(Date.now()/1000),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_version : '1.0',
          callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
        };

        var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_CONSUMER_SECRET, YELP_TOKEN_SECRET);
        parameters.oauth_signature = encodedSignature;

        var settings = {
          url: yelp_url,
          data: parameters,
          cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
          dataType: 'jsonp',
          fail: function() {
            console.log('ajax error');
          }
        };

        // Send AJAX query via jQuery library.
        $.ajax(settings).done(function ( data ) {
            location.yelpRating = data.rating;
            location.yelpReviewCount = data.review_count;
            location.yelpRatingImg = data.rating_img_url;
            console.log(data.rating_img_url);
            renderMarker ( location );
        });


};

var setVisibilty = function( filteredLocations ) {
    for (var i = 0; i < markers.length; i++) {


        for (var j = 0; j < filteredLocations.length; j++) {
            var filteredMark = filteredLocations[j];
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
        location.marker.setAnimation(google.maps.Animation.DROP);
        google.maps.event.trigger(location.marker, 'click');
    };

    loadMarkers = function () {
        renderMarkers(self.search());
    };

};

var loadYelp = function() {
    locations.forEach(function ( location ) {
        yelp( location );
    })
};

ko.applyBindings(new ViewModel());

$(document).ready(function() {
    loadYelp();
});