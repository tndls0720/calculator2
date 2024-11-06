const buttons = document.querySelectorAll("button");
const display = document.getElementById("display");

let firstOperand = null;
let operator = null;
let secondOperand = null;
let resetDisplay = false;

buttons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    const buttonValue = button.textContent;
    console.log(buttonValue);

    if (button.classList.contains("number")) {
      handleNumber(buttonValue);
    } else if (button.classList.contains("operator")) {
      handleOperator(buttonValue);
    } else if (button.classList.contains("function")) {
      handleFunction(buttonValue);
    }
  });
});

function handleNumber(number) {
  if (resetDisplay) {
    display.textContent = number;
    resetDisplay = false;
  } else {
    display.textContent =
      display.textContent === "0" ? number : display.textContent + number;
  }
}

function handleOperator(op) {
  if (op === "=") {
    if (firstOperand === null || operator === null) {
      return;
    }
    secondOperand = parseFloat(display.textContent);
    const result = calculate(firstOperand, operator, secondOperand);
    display.textContent = result;
    firstOperand = result;
    operator = null;
    secondOperand = null;
    resetDisplay = true;
  } else {
    if (firstOperand === null) {
      firstOperand = parseFloat(display.textContent);
      console.log("First Operand Set:", firstOperand);
    } else if (operator !== null) {
      secondOperand = parseFloat(display.textContent);
      firstOperand = calculate(firstOperand, operator, secondOperand);
      display.textContent = firstOperand;
      secondOperand = null;
    }
    operator = op;
    console.log("Operator Set:", operator);
    resetDisplay = true;
  }
}

function handleFunction(func) {
  switch (func) {
    case "C":
      firstOperand = null;
      operator = null;
      secondOperand = null;
      resetDisplay = true;
      display.textContent = "0";
      break;
    case "±":
      display.textContent = -parseFloat(display.textContent);
      break;
    case "%":
      display.textContent = parseFloat(display.textContent) / 100;
      break;
  }
  
  
}

function calculate(firstOperand, operator, secondOperand) {
  const num1 = parseFloat(firstOperand);
  const num2 = parseFloat(secondOperand);

  if (isNaN(num1) || isNaN(num2)) {
    return "Error: 숫자를 입력하세요.";
  }
  if (operator === "/" && num2 === 0) {
    return "Error: 0으로 나눌 수 없습니다.";
  }

  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num1 / num2;
    default:
      return "Error: 잘못된 연산자입니다.";
  }
}