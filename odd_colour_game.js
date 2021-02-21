
function init() {
  restart_button.style.visibility = "hidden";
  show_button.style.visibility = "hidden";
  show_button.innerHTML = "Show";
  level = 1;
  points = 0;
  boardSize = 2;
  colourChangeAmount = 25;
  sec_left = 10;
  tileHolder = [];
  redraw();
  timeoutVar = setTimeout(timeDown, 1000);
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
    clearTimeout(timeoutVar);
    if (this.style.backgroundColor == colourHolder[1]) {
      nextTurn();
    } else {
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

function generateRandomColour() {
  var colourHolder = [];
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  colourHolder.push("rgb("+ r + ", " + g + ", " + b + ")");

  var l = [r, g, b];
  for (x in l) {
    if (Math.floor(Math.random() * 2) == 1) {
      colourChangeAmount *= -1;
    }
    l[x] -= colourChangeAmount;
    if (l[x] < 0 || l[x] > 255) {
      l[x] += colourChangeAmount * 2;
    }
  }
  colourHolder.push("rgb("+ l[0] + ", " + l[1] + ", " + l[2] + ")");
  return colourHolder;
}

function makeButtonEvents() {
  restart_button.addEventListener("click", reset);
  show_button.addEventListener("click", showAnswer);
}

function reset() {
  destroyBoard();
  init();
}


function showAnswer() {
  var diffTile = tileHolder[diffIndex];
  for (x in tileHolder) {
    tileHolder[x].onclick = "none";
  }
  restart_button.style.visibility = "visible";
  show_button.style.visibility = "visible";
  if (show_button.innerHTML == "Show") {
    show_button.innerHTML = "Hide";
    diffTile.style.border = "3px solid " + makeBorderColour(colourHolder[1]);
    var currentSize = INTERFACE_SIZE / (boardSize + 1);
    diffTile.style.width = currentSize - 6 + "px";
    diffTile.style.height = currentSize - 6 + "px";
  } else {
    show_button.innerHTML = "Show";
    diffTile.style.border = "0px solid white";
    var currentSize = INTERFACE_SIZE / (boardSize + 1);
    diffTile.style.width = currentSize + "px";
    diffTile.style.height = currentSize + "px";
  }
}

function makeBorderColour(colour) {
  colour = colour.slice(4,-1);
  var rgb = colour.split(", ");
  var min = Math.min(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));
  for (x in rgb) {
    if (Number(rgb[x]) == min) {
      rgb[x] = 255;
    } else {
      rgb[x] = 0;
    }
  }
  return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

function nextTurn() {
  clearTimeout(timeoutVar);
  level += 1;
  points += Number(timer.innerHTML) * 50;
  sec_left = 10;
  redraw();
  timeoutVar = setTimeout(timeDown, 1000);
  if (Math.abs(colourChangeAmount) > 5) {
    colourChangeAmount = Math.abs(colourChangeAmount) - 1;
  }

  if (show_button.innerHTML = "Hide") {
    showAnswer();
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
  timer.innerHTML = sec_left;
}

function timeDown() {
  sec_left -= 1;
  var str = sec_left + "";
  timer.innerHTML = str.padStart(2,0);
  if (sec_left <= 0) {
    showAnswer();
    return;
  }
  timeoutVar = setTimeout(timeDown, 1000);
}

var diffIndex;
var timeoutVar;
var colourHolder;

var level;
var boardSize;
var points;
var colourChangeAmount;
var sec_left;
var tileHolder;

var interface = document.querySelector("#interface");
var restart_button = document.querySelector("#restart_button");
var show_button = document.querySelector("#show_button");
var level_span = document.querySelector("#level_span");
var point_span = document.querySelector("#point_span");
var timer = document.querySelector("#timer");
const INTERFACE_SIZE = 570-20; //We can see this in colour_test.css


makeButtonEvents();
init();
