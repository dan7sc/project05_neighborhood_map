// Open the drawer when the menu is clicked.

var menu = $('#menu');
var main = $('header, footer, .map-canvas, .list');
var drawer = $('.drawer');

menu.on('click', function(e) {
  drawer.toggleClass('open');
  e.stopPropagation();
});
main.on('click', function() {
  drawer.removeClass('open');
});
