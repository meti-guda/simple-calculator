class Calculator {
  constructor() {
    this.displayValue = "0";
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;

    // your display div has class="expression"
    this.displayElement = document.querySelector(".expression");

    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    // number buttons: have data-value with 0–9 but NO data-action
    document.querySelectorAll(".values button").forEach((btn) => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      if (!action && value !== undefined) {
        // treat as number or dot key
        if (value === ".") {
          btn.addEventListener("click", () => this.handleDecimal());
        } else {
          btn.addEventListener("click", () => this.handleNumber(value));
        }
      } else if (action) {
        // action keys
        if (action === "equals") {
          btn.addEventListener("click", () => this.handleEquals());
        } else if (action === "clear") {
          btn.addEventListener("click", () => this.handleClear());
        } else if (action === "del") {
          btn.addEventListener("click", () => this.handleDelete());
        }
      }

      // operator keys have data-value of + - * / %
      if (["+", "-", "*", "/", "%"].includes(value)) {
        btn.addEventListener("click", () => this.handleOperator(value));
      }
    });

    // keyboard support
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  handleNumber(num) {
    if (this.shouldResetDisplay) {
      this.displayValue = num;
      this.shouldResetDisplay = false;
    } else {
      this.displayValue =
        this.displayValue === "0" ? num : this.displayValue + num;
    }
    this.updateDisplay();
  }

  handleDecimal() {
    if (this.shouldResetDisplay) {
      this.displayValue = "0.";
      this.shouldResetDisplay = false;
    } else if (!this.displayValue.includes(".")) {
      this.displayValue += ".";
    }
    this.updateDisplay();
  }

  handleOperator(op) {
    const current = parseFloat(this.displayValue);

    if (this.previousValue === null) {
      this.previousValue = current;
    } else if (this.operation) {
      const result = this.calculate(
        this.previousValue,
        current,
        this.operation
      );
      this.displayValue = this.formatResult(result);
      this.previousValue = result;
      this.updateDisplay();
    }

    this.operation = op;
    this.shouldResetDisplay = true;
  }

  handleEquals() {
    if (this.operation === null || this.previousValue === null) {
      return;
    }

    const current = parseFloat(this.displayValue);
    const result = this.calculate(this.previousValue, current, this.operation);
    this.displayValue = this.formatResult(result);
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  handleClear() {
    this.displayValue = "0";
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.updateDisplay();
  }

  handleDelete() {
    if (this.displayValue === "0" || this.shouldResetDisplay) {
      return;
    }
    this.displayValue = this.displayValue.slice(0, -1) || "0";
    this.updateDisplay();
  }

  calculate(prev, current, op) {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "*":
        return prev * current;
      case "/":
        return current !== 0 ? prev / current : 0;
      case "%":
        return prev % current;
      default:
        return current;
    }
  }

  formatResult(num) {
    return parseFloat(num.toFixed(10)).toString();
  }

  handleKeyboard(e) {
    if (e.key >= "0" && e.key <= "9") this.handleNumber(e.key);
    if (e.key === ".") this.handleDecimal();
    if (["+", "-", "*", "/", "%"].includes(e.key)) {
      e.preventDefault();
      this.handleOperator(e.key);
    }
    if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      this.handleEquals();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      this.handleDelete();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      this.handleClear();
    }
  }

  updateDisplay() {
    this.displayElement.textContent = this.displayValue;
  }
}

// create calculator once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
