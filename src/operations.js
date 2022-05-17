import Big from "big.js";

const operators = {
  "×": function (a, b) {
    return Big(a).times(Big(b)).toNumber().toString();
  },
  "÷": function (a, b) {
    return Big(a).div(Big(b)).toNumber().toString();
  },
  "+": function (a, b) {
    return Big(a).plus(Big(b)).toNumber().toString();
  },
  "-": function (a, b) {
    return Big(a).minus(Big(b)).toNumber().toString();
  },
};

function isInt(num) {
  return num % 1 === 0;
}

export { operators, isInt };
