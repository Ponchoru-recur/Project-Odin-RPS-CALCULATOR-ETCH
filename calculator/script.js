const currentDisplay = document.querySelector("#current");
const historyDisplay = document.querySelector("#history");
const decimalBtn = document.querySelector("#decimal-btn");
const operatorBtns = document.querySelectorAll("[data-operator]");

const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const MAX_DIGITS = 15;

// The three parts of an operation plus a few state flags.
let firstNumber = null;
let operator = null;
let currentInput = "0";
let startNewNumber = false;
let hasError = false;

// Basic math helpers.
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

// Calls the matching math helper for the given operator.
function operate(op, a, b) {
  switch (op) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return b;
  }
}

// Rounds long decimals so they don't overflow the screen.
function formatNumber(number) {
  return String(Number(number.toPrecision(12)));
}

// Pushes the current state onto the screen.
function updateDisplay() {
  currentDisplay.textContent = currentInput;
  decimalBtn.disabled = !startNewNumber && currentInput.includes(".");
  operatorBtns.forEach((btn) => {
    btn.classList.toggle("active", startNewNumber && btn.dataset.operator === operator);
  });
}

// Resets everything back to a blank calculator.
function clearAll() {
  firstNumber = null;
  operator = null;
  currentInput = "0";
  startNewNumber = false;
  hasError = false;
  historyDisplay.textContent = "";
  updateDisplay();
}

// hows an error message and locks input until a new number is typed
function showError(message) {
  clearAll();
  currentInput = message;
  hasError = true;
  startNewNumber = true;
  updateDisplay();
}

// Adds a digit to the number being typed
function inputDigit(digit) {
  if (startNewNumber || hasError) {
    currentInput = digit;
    startNewNumber = false;
    hasError = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.replace(/[-.]/g, "").length < MAX_DIGITS) {
    currentInput += digit;
  }
  updateDisplay();
}

// Adds a decimal point, only once per number.
function inputDecimal() {
  if (startNewNumber || hasError) {
    currentInput = "0.";
    startNewNumber = false;
    hasError = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

// Runs the pending operation. Returns false if it was a divide by zero.
function evaluate() {
  const secondNumber = Number(currentInput);
  if (operator === "/" && secondNumber === 0) {
    showError("Nice try. No ÷ 0");
    return false;
  }
  const result = operate(operator, firstNumber, secondNumber);
  currentInput = formatNumber(result);
  return true;
}

// Stores the chosen operator, evaluating the previous pair first if needed.
function chooseOperator(nextOperator) {
  if (hasError) return;

  // Pressing operators back to back just swaps the operator.
  if (operator !== null && startNewNumber) {
    operator = nextOperator;
    historyDisplay.textContent = `${formatNumber(firstNumber)} ${SYMBOLS[operator]}`;
    updateDisplay();
    return;
  }

  // Chaining like 12 + 7 - ... evaluates 12 + 7 first.
  if (operator !== null) {
    if (!evaluate()) return;
  }

  firstNumber = Number(currentInput);
  operator = nextOperator;
  startNewNumber = true;
  historyDisplay.textContent = `${formatNumber(firstNumber)} ${SYMBOLS[operator]}`;
  updateDisplay();
}

// Handles "=": does nothing until both numbers and an operator exist.
function pressEquals() {
  if (hasError || operator === null || startNewNumber) return;

  const expression = `${formatNumber(firstNumber)} ${SYMBOLS[operator]} ${currentInput} =`;
  if (!evaluate()) return;

  historyDisplay.textContent = expression;
  firstNumber = null;
  operator = null;
  startNewNumber = true;
  updateDisplay();
}

// Removes the last typed character.
function backspace() {
  if (hasError || startNewNumber) return;
  currentInput = currentInput.slice(0, -1);
  if (currentInput === "" || currentInput === "-") currentInput = "0";
  updateDisplay();
}

// Turns the current number into a percentage.
function percent() {
  if (hasError) return;
  currentInput = formatNumber(Number(currentInput) / 100);
  startNewNumber = false;
  updateDisplay();
}

// Routes button clicks to the right handler.
document.querySelector(".buttons").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  if (btn.dataset.digit) inputDigit(btn.dataset.digit);
  else if (btn.dataset.operator) chooseOperator(btn.dataset.operator);
  else if (btn.dataset.action === "decimal") inputDecimal();
  else if (btn.dataset.action === "equals") pressEquals();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "backspace") backspace();
  else if (btn.dataset.action === "percent") percent();

  btn.blur();
});

// Keyboard support for digits, operators and shortcuts.
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) inputDigit(key);
  else if (key === ".") inputDecimal();
  else if (key in SYMBOLS) chooseOperator(key);
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    pressEquals();
  } else if (key === "Backspace") backspace();
  else if (key === "Escape" || key === "Delete") clearAll();
  else if (key === "%") percent();
});

updateDisplay();
