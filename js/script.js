
var map;

// Create a new blank array for all markers.
var markers = [];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
// Create an array of markers on initialize.
  for (let i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    let position = locations[i].location;
    let title = locations[i].title;
    // Create a marker per location, and put into markers array.
     let marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
  }
  showMarkers();

  ko.applyBindings(new ViewModel());
}

// This function will loop through the markers array and display them all.
function showMarkers() {
  let bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}


var ViewModel = function() {
  var self = this;
  this.currentMarkers = ko.observableArray([]);
  this.current = ko.observable("");


  function setMarkers(data) {
    this.title = data.title;
    this.position = data.position;
    this.id = data.id;

    this.visible = true;
  }

  for (var i = 0; i < markers.length; i++) {
    let newMarker = markers[i];
    this.currentMarkers.push(new setMarkers(newMarker));
  }

  this.filterMarkers = ko.computed(function() {
    let filteredMarkers = [];
    for(let i = 0; i < self.currentMarkers().length; i++) {
      if(self.currentMarkers()[i].title.toLowerCase().includes(self.current().toLowerCase())) {
        filteredMarkers.push(self.currentMarkers()[i]);
      }
    }
    return filteredMarkers;
  });

/*
  this.filterMarkers = ko.computed(function() {
    //console.log(self.currentMarkers().length);
    let filteredMarkers = [];
    for(let i = 0; i < self.currentMarkers().length; i++) {
      //filteredMarkers = self.currentMarkers()[i];
      //console.log(filteredMarkers.title.toLowerCase(), "--", self.current().toLowerCase());
      if(self.currentMarkers()[i].title.toLowerCase().includes(self.current().toLowerCase())) {
        //currentFilter.push(filteredMarkers);
        self.currentMarkers()[i].visible = true;
        filteredMarkers.push(self.currentMarkers()[i]);
      }
      else {
        self.currentMarkers()[i].visible = false;
      }
    }
    //console.log(self.currentMarkers());
    return filteredMarkers;
  });

/*
  this.filterMarkers = ko.computed(function() {
    let currentFilter = [];
    let filteredMarkers;
    //console.log(self.currentMarkers().length);
    for(let i = 0; i < self.currentMarkers().length; i++) {
      filteredMarkers = self.currentMarkers()[i];
      //console.log(filteredMarkers.title.toLowerCase(), "--", self.current().toLowerCase());
      if(filteredMarkers.title.toLowerCase().includes(self.current().toLowerCase())) {
        currentFilter.push(filteredMarkers);
      }
    }
    //console.log(currentFilter);
    return currentFilter;
  });
*/

}
