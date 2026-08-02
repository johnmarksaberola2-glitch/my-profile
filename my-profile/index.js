function calculate(a, b, operator) {
  const operations = {
    "+": a + b,
    "-": a - b,
    "*": a * b,
    "/": b ? a / b : "Division by zero is not allowed"
  };

  return operations[operator] ?? "Invalid operator";
}

console.log(calculate(9, 5, "+"));
console.log(calculate(8, 5, "-"));
console.log(calculate(7, 5, "*"));
console.log(calculate(0, 0, "/"));