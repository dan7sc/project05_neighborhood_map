
var map;

// Create a new blank array for all markers
var markers = [];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
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

  // This function will filter locations by name
  this.filterMarkers = ko.computed(function() {
    let filteredMarkers = [];
    for(let i = 0; i < self.currentLocations().length; i++) {
      if(self.currentLocations()[i].title.toLowerCase().includes(self.current().toLowerCase())) {
        filteredMarkers.push(self.currentLocations()[i]);
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

// This function will store information about a location
function setLocation(data, id) {
  this.title = data.title;
  this.position = data.position;
  this.id = id;
}
