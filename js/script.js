
var map;
var infoWindow;
// Create a new blank array for all markers
var markers = [];
// FourSquare jquery element
var $foursquareElem = $('#foursquare-links');
// Flickr jquery element
var $flickrElem = $('#flickr-links');
// FourSquare client id
var clientID = "INMCOI5N21EXKPZABYDFXGQK2YA3QMWWCA4EO2Y3VGT4ZSMS";
// FourSquare client secret
var client_secret = "CN5DI1ILH05BM0KITSPPCGH0I4IBDXXGCKYQN4JKSHPLHVZ3";
// Flickr client key
var client_key = "2f201af775b1b5eea625f0b72ede4b7c";


function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
  // Constructor creates a new infowindow
  infoWindow = new google.maps.InfoWindow();
  // Create an array of markers on initialize
  for (let i = 0; i < locations.length; i++) {
    // Get the position from the location array
    let position = locations[i].location;
    let title = locations[i].title;
    // Create a marker per location, and put into markers array
     let marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Animate the marker and display infowindow
    // when the marker is clicked
    marker.addListener('click', function() {
      animateMarker(this);
      populateInfoWindow(this, infoWindow);
      loadFourSquareData(this);
      loadFlickrData(this);
    });
    // Push the marker to our array of markers
    markers.push(marker);
  }
  showMarkers();
  // This makes Knockout get to work
  ko.applyBindings(new ViewModel());
}

var ViewModel = function() {
  let self = this;
  // observable array for list of locations
  this.currentLocations = ko.observableArray([]);
  // observable for current location
  this.current = ko.observable("");

  // This loop will put the locations in a observable array
  for (let i = 0; i < locations.length; i++) {
    let newLocation = locations[i];
    this.currentLocations.push(new setLocation(newLocation, i));
  }

  // This function filters locations by name in the list
  // and filters markers in the map
  this.filterMarkers = ko.computed(function() {
    let filteredMarkers = [];
    closeInfoWindow(infoWindow);
    for(let i = 0; i < self.currentLocations().length; i++) {
      if(self.currentLocations()[i].title.toLowerCase().includes(self.current().toLowerCase())) {
        filteredMarkers.push(self.currentLocations()[i]);
        markers[i].setVisible(true);
      }
      else {
        markers[i].setVisible(false);
      }
    }
    // return a list of locations filtered by name
    return filteredMarkers;
  });
}

// This function will loop through the markers array and display them all
function showMarkers() {
  let bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function stores information about a location
function setLocation(data, id) {
  this.title = data.title;
  this.position = data.location;
  this.id = id;
}

// This function populates the infowindow when the marker is clicked
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

// This function shows the infowindow through the list
// animates the marker and load wikipedia data
function showInfoWindow(data, event) {
  if(event.type == 'click') {
    animateMarker(markers[data.id]);
    populateInfoWindow(markers[data.id], infoWindow);
    loadFourSquareData(markers[data.id]);
    loadFlickrData(markers[data.id]);
  }
}

// This function closes the infowindow
function closeInfoWindow(infowindow) {
  if(infowindow) {
    infowindow.close();
  }
}

// This function animates the infowindow
function animateMarker(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  }
  else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // Marker bounces during two milliseconds
    setTimeout((function() {
      marker.setAnimation(null);
    }), 2000);
  }
}

// Function loads foursquare data
function loadFourSquareData(marker) {
  // Clean foursquare element
  $foursquareElem.text("");
  // Set foursquare url
  let foursquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + clientID + '&client_secret=' + client_secret + '&v=20180323' + '&ll=' + marker.position.lat() + ',' + marker.position.lng() + '&limit=1';

  $.getJSON(foursquareUrl, function(data) {
    // Get the response
    let response = data.response.venues[0];
    // Get information about the marker
    let id = response.id;
    let address = response.location.formattedAddress[0];
    let city = response.location.formattedAddress[1];
    let country = response.location.formattedAddress[2];

    // Set information in the page
    $foursquareElem.append('<li>' + address + '</li>');
    $foursquareElem.append('<li>' + city + '</li>');
    $foursquareElem.append('<li>' + country + '</li>');

    // Set foursquare photo url
    let foursquarePhotoUrl = 'https://api.foursquare.com/v2/venues/' + id + '/photos?client_id=' + clientID + '&client_secret=' + client_secret + '&v=20180323' + '&ll=' + marker.position.lat() + ',' + marker.position.lng() + '&limit=1';
    let photoUrl = '';

    $.getJSON(foursquarePhotoUrl, function(photoData) {
      // Get response
      let response = photoData.response.photos.items[0];
      // Define photo path
      photoUrl = response.prefix + '200x200' + response.suffix;
      // Set photo in the page
      $foursquareElem.append('<img src=' + photoUrl + ' alt="' + marker.title + '" />');
    }).fail(function() {
      $foursquareElem.append('Four Square Photo Could Not Be Loaded');
    });

  }).fail(function() {
    $foursquareElem.text('Four Square Data Could Not Be Loaded');
  });
}

// Function loads flickr data
function loadFlickrData(marker) {
  // Clean flickr element
  $flickrElem.text("");
  // Set flickr url
  let flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + client_key + '&media=photos&privacy_filter=1&format=json&lat=' + marker.position.lat() + '&lon=' + marker.position.lng() + '&radius=.1&radius_units=mi';

  $.ajax({
    url: flickrUrl,
    dataType: "jsonp",
    jsonp: "jsoncallback"
  }).done(function(response) {
    // Choose random photo index
    let index = Math.round((Math.random()*100)%10);
    // Get response
    let data = response.photos.photo[index];
    // Get photo details
    let id = data.id;
    let owner = data.owner;
    let secret = data.secret;
    let server = data.server;
    let farm = data.farm;
    let title = data.title;
    let size = 'm';
    // Set photo in the page
    $flickrElem.append('<img src="https://farm'+ farm +'.staticflickr.com/'+ server +'/'+ id +'_'+ secret + '_' + size + '.jpg" alt="' + title + '" />');
  }).fail(function() {
    $flickrElem.append('Flickr Data Could Not Be Loaded');
  });
}
