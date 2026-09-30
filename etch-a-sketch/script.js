const container = document.querySelector("#container");
const gridInfo = document.querySelector("#grid-info");
const resizeBtn = document.querySelector("#resize-btn");
const modeBtn = document.querySelector("#mode-btn");
const clearBtn = document.querySelector("#clear-btn");

let gridSize = 16;
let rainbowMode = true;

// returns a random rgb() color string.
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Colors a square and darkens it by 10% on every pass
function paintSquare(square) {
  const passes = Math.min(Number(square.dataset.passes) + 1, 10);
  square.dataset.passes = passes;
  square.style.backgroundColor = rainbowMode ? randomColor() : "black";
  square.style.opacity = passes / 10;
}

// Builds a size x size grid of divs inside the container
function createGrid(size) {
  container.innerHTML = "";
  const squareSize = `${100 / size}%`;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = squareSize;
    square.style.height = squareSize;
    square.dataset.passes = 0;
    square.addEventListener("mouseenter", () => paintSquare(square));
    container.appendChild(square);
  }

  gridInfo.textContent = `${size} x ${size}`;
}

// Ask for a new grid size 1 to 100 and rebuilds the grid.
resizeBtn.addEventListener("click", () => {
  const input = prompt("How many squares per side? (1 - 100)", gridSize);
  if (input === null) return;

  const size = Number(input);
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    alert("Please enter a whole number from 1 to 100.");
    return;
  }

  gridSize = size;
  createGrid(gridSize);
});

// switches between rainbow and plain black ink.
modeBtn.addEventListener("click", () => {
  rainbowMode = !rainbowMode;
  modeBtn.textContent = rainbowMode ? "Mode: Rainbow" : "Mode: Black";
});

//Wipes the drawing but keeps the same grid size.
clearBtn.addEventListener("click", () => createGrid(gridSize));

createGrid(gridSize);
