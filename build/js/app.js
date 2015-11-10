// var googleAPIKey = AIzaSyBqKk_buo1F45vURvpqTQqZz4JyopNL9hQ;

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0, lng: -118.25},
    zoom: 11
  });
}