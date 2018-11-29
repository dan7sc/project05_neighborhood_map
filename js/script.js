
var map;
var infoWindow;
// Create a new blank array for all markers
var markers = [];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
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
function showInfoWindow(data, event) {
  if(event.type == 'click') {
    animateMarker(markers[data.id]);
    populateInfoWindow(markers[data.id], infoWindow);
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
