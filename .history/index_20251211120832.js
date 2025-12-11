const expressionEl = document.getElementById("expression");
const keys = document.querySelector(".keys");

let expression = "0";
let justEvaluated = false;

function updateDisplay() {
  expressionEl.textContent = expression;
}

function appendValue(val) {
  if (justEvaluated) {
    // start new expression if a number or dot is pressed after equals
    if (/[0-9.]/.test(val)) {
      expression = val;
    } else {
      expression += val;
    }
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (expression === "0" && /[0-9.]/.test(val)) {
    expression = val === "." ? "0." : val;
  } else if (val === ".") {
    // prevent multiple dots in current number
    const parts = expression.split(/[\+\-\*\/%]/);
    const lastPart = parts[parts.length - 1];
    if (!lastPart.includes(".")) {
      expression += ".";
    }
  } else {
    expression += val;
  }
  updateDisplay();
}

function clearAll() {
  expression = "0";
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  if (expression.length <= 1) {
    expression = "0";
  } else {
    expression = expression.slice(0, -1);
  }
  updateDisplay();
}

function evaluateExpression() {
  try {
    // avoid trailing operator errors
    if (/[\+\-\*\/%]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    const result = Function(`"use strict"; return (${expression});`)();
    expression = String(result);
    justEvaluated = true;
    updateDisplay();
  } catch {
    expression = "Error";
    justEvaluated = true;
    updateDisplay();
  }
}

/* Button clicks */

keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === "clear") {
    clearAll();
  } else if (action === "del") {
    deleteLast();
  } else if (action === "equals") {
    evaluateExpression();
  } else if (value) {
    appendValue(value);
  }
});

/* Keyboard support */

document.addEventListener("keydown", (e) => {
  const { key } = e;

  if (/[0-9]/.test(key)) {
    appendValue(key);
  } else if (["+", "-", "*", "/", "%"].includes(key)) {
    appendValue(key);
  } else if (key === ".") {
    appendValue(".");
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    evaluateExpression();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});
