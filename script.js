// 모든 버튼 요소와 표시 화면 요소를 선택
const buttons = document.querySelectorAll("button"); // HTML 문서 내의 모든 <button> 요소를 선택하여 NodeList로 저장
const display = document.getElementById("display");  // id가 "display"인 요소를 선택하여 저장 (계산기 화면)

// 계산에 필요한 변수들을 초기화
let firstOperand = null;     // 첫 번째 피연산자 (예: 2 + 3에서 '2')
let operator = null;         // 연산자 (예: '+', '-', '*', '/')
let secondOperand = null;    // 두 번째 피연산자 (예: 2 + 3에서 '3')
let resetDisplay = false;    // 다음 숫자 입력 시 디스플레이를 초기화할지 여부를 나타내는 플래그

// 모든 버튼에 클릭 이벤트 리스너를 추가
buttons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    const buttonValue = button.textContent;   // 클릭된 버튼의 텍스트 내용을 가져옴
    console.log(buttonValue);                 // 클릭된 버튼의 값을 콘솔에 출력 (디버깅 용도)

    // 버튼의 클래스에 따라 적절한 처리 함수 호출
    if (button.classList.contains("number")) {       // 버튼이 숫자일 경우
      handleNumber(buttonValue);                     // 숫자 처리 함수 호출
    } else if (button.classList.contains("operator")) { // 버튼이 연산자일 경우
      handleOperator(buttonValue);                   // 연산자 처리 함수 호출
    } else if (button.classList.contains("function")) { // 버튼이 기능 버튼일 경우 (예: C, ±, %)
      handleFunction(buttonValue);                   // 기능 처리 함수 호출
    }
  });
});

/**
 * 숫자 버튼 클릭 시 처리하는 함수
 * @param {string} number - 클릭된 숫자 버튼의 값
 */
function handleNumber(number) {
  if (resetDisplay) { // 화면을 초기화해야 하는 경우
    display.textContent = number; // 디스플레이에 새로운 숫자를 표시
    resetDisplay = false;          // 초기화 플래그를 해제
  } else {
    // 디스플레이가 "0"인 경우 새로운 숫자로 대체, 그렇지 않으면 기존 숫자에 이어붙임
    display.textContent =
      display.textContent === "0" ? number : display.textContent + number;
  }
}

/**
 * 연산자 버튼 클릭 시 처리하는 함수
 * @param {string} op - 클릭된 연산자 버튼의 값
 */
function handleOperator(op) {
  if (op === "=") { // "=" 버튼이 클릭된 경우
    // 계산을 수행하기 위해 필요한 값들이 모두 설정되어 있는지 확인
    if (firstOperand === null || operator === null) {
      return; // 필요한 값이 없으면 함수 종료
    }
    secondOperand = parseFloat(display.textContent); // 현재 디스플레이 값을 두 번째 피연산자로 설정
    const result = calculate(firstOperand, operator, secondOperand); // 계산 수행
    display.textContent = result; // 계산 결과를 디스플레이에 표시
    firstOperand = result;        // 계산 결과를 첫 번째 피연산자로 설정 (연속 계산을 위해)
    operator = null;              // 연산자 초기화
    secondOperand = null;         // 두 번째 피연산자 초기화
    resetDisplay = true;          // 다음 입력 시 디스플레이를 초기화하도록 플래그 설정
  } else { // "+" 또는 "-" 등 다른 연산자 버튼이 클릭된 경우
    if (firstOperand === null) { // 첫 번째 피연산자가 아직 설정되지 않은 경우
      firstOperand = parseFloat(display.textContent); // 현재 디스플레이 값을 첫 번째 피연산자로 설정
      console.log("First Operand Set:", firstOperand); // 첫 번째 피연산자 설정을 콘솔에 출력
    } else if (operator !== null) { // 이미 연산자가 설정되어 있는 경우
      secondOperand = parseFloat(display.textContent); // 현재 디스플레이 값을 두 번째 피연산자로 설정
      firstOperand = calculate(firstOperand, operator, secondOperand); // 기존 연산자를 사용하여 계산
      display.textContent = firstOperand; // 계산 결과를 디스플레이에 표시
      secondOperand = null; // 두 번째 피연산자 초기화
    }
    operator = op; // 새로운 연산자로 설정
    console.log("Operator Set:", operator); // 연산자 설정을 콘솔에 출력
    resetDisplay = true; // 다음 입력 시 디스플레이를 초기화하도록 플래그 설정
  }
}

/**
 * 기능 버튼 클릭 시 처리하는 함수 (C, ±, %)
 * @param {string} func - 클릭된 기능 버튼의 값
 */
function handleFunction(func) {
  switch (func) {
    case "C": // "C" 버튼: 계산기 초기화
      firstOperand = null;       // 첫 번째 피연산자 초기화
      operator = null;           // 연산자 초기화
      secondOperand = null;      // 두 번째 피연산자 초기화
      resetDisplay = true;       // 디스플레이를 초기화하도록 플래그 설정
      display.textContent = "0"; // 디스플레이를 "0"으로 설정
      break;
    case "±": // "±" 버튼: 현재 숫자의 부호를 반전
      display.textContent = -parseFloat(display.textContent); // 디스플레이에 표시된 숫자의 부호를 반전하여 다시 표시
      break;
    case "%": // "%" 버튼: 현재 숫자를 백분율로 변환
      display.textContent = parseFloat(display.textContent) / 100; // 디스플레이에 표시된 숫자를 100으로 나누어 다시 표시
      break;
    // 필요한 경우 추가 기능을 여기서 처리할 수 있습니다.
  }
}

/**
 * 두 피연산자와 연산자를 받아서 계산을 수행하는 함수
 * @param {number} firstOperand - 첫 번째 피연산자
 * @param {string} operator - 연산자 (+, -, *, /)
 * @param {number} secondOperand - 두 번째 피연산자
 * @returns {number|string} 계산 결과 또는 오류 메시지
 */
function calculate(firstOperand, operator, secondOperand) {
  const num1 = parseFloat(firstOperand);    // 첫 번째 피연산자를 숫자로 변환
  const num2 = parseFloat(secondOperand);   // 두 번째 피연산자를 숫자로 변환

  // 피연산자 중 하나라도 숫자가 아닌 경우 오류 메시지 반환
  if (isNaN(num1) || isNaN(num2)) {
    return "Error: 숫자를 입력하세요.";
  }

  // 나눗셈에서 두 번째 피연산자가 0인 경우 오류 메시지 반환
  if (operator === "/" && num2 === 0) {
    return "Error: 0으로 나눌 수 없습니다.";
  }

  // 연산자에 따라 계산을 수행
  switch (operator) {
    case "+": // 덧셈
      return num1 + num2;
    case "-": // 뺄셈
      return num1 - num2;
    case "*": // 곱셈
      return num1 * num2;
    case "/": // 나눗셈
      return num1 / num2;
    default: // 유효하지 않은 연산자일 경우 오류 메시지 반환
      return "Error: 잘못된 연산자입니다.";
  }
}