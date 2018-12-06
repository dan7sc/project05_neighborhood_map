// Open the drawer when the menu ison is clicked.

var menu = $('#menu');
var main = $('header, .map-canvas, .list');
var drawer = $('.drawer');

menu.on('click', function(e) {
  drawer.toggleClass('open');
  e.stopPropagation();
});
main.on('click', function() {
  drawer.removeClass('open');
});
