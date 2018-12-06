// Open the drawer when the menu ison is clicked.

let menu = document.querySelector('#menu');
let main = document.querySelector('main');
let drawer = document.querySelector('#drawer');

menu.addEventListener('click', function(e) {
  console.log("menu open");
  drawer.classList.toggle('open');
  e.stopPropagation();
});
main.addEventListener('click', function() {
  console.log("menu close");
  drawer.classList.remove('open');
});
