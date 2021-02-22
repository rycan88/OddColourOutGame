
function init() {
  restart_button.style.visibility = "hidden";
  show_button.style.visibility = "hidden";
  show_button.innerHTML = "Show";
  level = 1;
  points = 0;
  boardSize = 2;
  colourChangeAmount = 25;
  start_sec = 10;
  tileHolder = [];
  starting_date = new Date();
  body.style.backgroundColor = INIT_BACKGROUND_COLOUR;
  setTimeout(redraw, 100);
  createBoard();
}


function createBoard() {
  colourHolder = generateRandomColour();
  diffIndex = Math.floor(Math.random() * (boardSize ** 2));
  for (y = 0; y < boardSize; y++) {
    for (x = 0; x < boardSize; x++) {
      if (diffIndex == y * boardSize + x) {
        createTile(colourHolder[1]);
      } else {
        createTile(colourHolder[0]);
      }
    }
  }
}

function createTile(colour) {
  var newTile = document.createElement("div");
  interface.appendChild(newTile);
  tileHolder.push(newTile);
  newTile.className = "tiles";

  var newSize = INTERFACE_SIZE / (boardSize + 1);
  var newMargin = newSize / (boardSize * 2);
  newTile.style.width = newSize + "px";
  newTile.style.height = newSize + "px";
  newTile.style.margin = newMargin + "px";
  newTile.style.backgroundColor = colour;

  newTile.onclick = function() {
    if (this.style.backgroundColor == colourHolder[1]) {
      nextTurn();
    } else {
      clearTimeout(timeoutVar);
      showAnswer();
    }
  };
}

function destroyBoard() {
  for (x = boardSize ** 2 - 1; x >= 0; x--) {
    tileHolder[x].remove();
  }
  tileHolder = [];
}

function generateRandomColour() { // generates a colour and the diff colour
  var colourHolder = [];
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  var l = [r, g, b];
  colourHolder.push(listToRgb(l));

  for (x in l) {
    if (Math.floor(Math.random() * 2) == 1) {
      colourChangeAmount *= -1;
    }
    l[x] -= colourChangeAmount;
    if (l[x] < 0 || l[x] > 255) {
      l[x] += colourChangeAmount * 2;
    }
  }
  colourHolder.push(listToRgb(l));
  return colourHolder;
}

function makeButtonEvents() {
  restart_button.addEventListener("click", reset);
  show_button.addEventListener("click", showAnswer);
  main_menu.addEventListener("click", function() {
    changeBackground(TEXT_FONT_COLOUR, INIT_BACKGROUND_COLOUR);
    game.style.display = "block";
    main_menu.style.display = "none";
    setTimeout(function() {
      init();
    } ,1950);


  });
}

function reset() {
  clearTimeout(timeoutVar);
  destroyBoard();
  init();
}


function showAnswer() {
  clearTimeout(timeoutVar);
  var diffTile = tileHolder[diffIndex];
  for (x in tileHolder) {
    tileHolder[x].onclick = "none";
  }
  restart_button.style.visibility = "visible";
  show_button.style.visibility = "visible";
  if (show_button.innerHTML == "Show") {
    show_button.innerHTML = "Hide";
    changeBackground(body.style.backgroundColor, colourHolder[0]);
  } else {
    show_button.innerHTML = "Show";
    changeBackground(body.style.backgroundColor, INIT_BACKGROUND_COLOUR);
  }
}

function rgbToList(rgb) {
  rgb = rgb.slice(4,-1);
  rgb = rgb.split(", ");
  return rgb.map(Number);
}

function listToRgb(lst) {
  return "rgb(" + lst.join(", ") + ")";
}

function nextTurn() {
  level += 1;
  points += Number(timer.innerHTML) * 50;
  start_sec = 10;
  starting_date = new Date();
  if (Math.abs(colourChangeAmount) > 5) {
    colourChangeAmount = Math.abs(colourChangeAmount) - 1;
  }

  restart_button.style.visibility = "hidden";
  show_button.style.visibility = "hidden";

  destroyBoard();

  switch (level) {
    case 5:
      boardSize = 3;
      break;
    case 11:
      boardSize = 4;
      break;
    case 19:
      boardSize = 5;
      break;
    case 29:
      boardSize = 6;
      break;
  }

  createBoard();
}

function redraw() {
  level_span.innerHTML = level;
  point_span.innerHTML = points;
  var current_date = new Date();
  var sec_left = 10 - Math.floor((current_date.getTime() - starting_date.getTime()) / 1000);
  var str = sec_left + "";
  timer.innerHTML = str.padStart(2,0);
  if (sec_left <= 0) {
    showAnswer();
    return;
  }
  timeoutVar = setTimeout(redraw, 100);
}

function changeBackground(init_rgb, new_rgb) {
  if (init_rgb == new_rgb) {
    return;
  }
  var init_colour = rgbToList(init_rgb);
  var new_colour = rgbToList(new_rgb);
  for (x = 0; x < 3; x++) {
    if (init_colour[x] != new_colour[x]) {
      if (init_colour[x] < new_colour[x]) {
        init_colour[x] += 1;
      } else {
        init_colour[x] -= 1;
      }
    }
  }
  var current_rgb = listToRgb(init_colour);
  body.style.backgroundColor = current_rgb;
  timeoutVar = setTimeout(changeBackground, 15, current_rgb, new_rgb);

}
// Global variables assigned places other than init()
var diffIndex; // index of different colour
// colourHolder[0] is the normal colour, colourHolder[1] is the different one
var colourHolder;
var timeoutVar; // variable to store timeouts


// Global variables assigned in init()
var level;
var boardSize;
var points;
var colourChangeAmount;
var start_sec;
var tileHolder;
var starting_date;



var body = document.querySelector("body");
var main_menu = document.querySelector("#main_menu");
var game = document.querySelector("#game");
var interface = document.querySelector("#interface");
var restart_button = document.querySelector("#restart_button");
var show_button = document.querySelector("#show_button");
var level_span = document.querySelector("#level_span");
var point_span = document.querySelector("#point_span");
var timer = document.querySelector("#timer");


const INTERFACE_SIZE = 570-20; //We can see this in colour_test.css
const INIT_BACKGROUND_COLOUR = "rgb(40, 40, 40)"; // Initial background colour
const TEXT_FONT_COLOUR = "rgb(160, 160, 160)";

makeButtonEvents();
// Program starts when the main menu is clicked
