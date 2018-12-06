// Open the drawer when the menu ison is clicked.

let menu = $('#menu');
let main = $('header, .map-canvas, .list');
let drawer = $('.drawer');

menu.on('click', function(e) {
  drawer.toggleClass('open');
  e.stopPropagation();
});
main.on('click', function() {
  drawer.removeClass('open');
});
