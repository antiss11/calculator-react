import logo from "./logo.svg";
import "./App.css";
import Big from "big.js";
import { Button, LargeButton } from "./Button";
import Display from "./Display";
import React from "react";
import parse from "html-react-parser";

const operators = {
  "×": function (a, b) {
    return Big(a).times(Big(b)).toNumber();
  },
  "÷": function (a, b) {
    return Big(a).div(Big(b)).toNumber();
  },
  "+": function (a, b) {
    return Big(a).plus(Big(b)).toNumber();
  },
  "-": function (a, b) {
    return Big(a).minus(Big(b)).toNumber();
  },
};

function isInt(num) {
  return num % 1 === 0;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "0",
      history: null,
      isNewValue: false,
      cache: 0,
      clearHistory: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.digitPress = this.digitPress.bind(this);
    this.zeroPress = this.zeroPress.bind(this);
    this.dotPress = this.dotPress.bind(this);
    this.operatorPress = this.operatorPress.bind(this);
    this.resultPress = this.resultPress.bind(this);
    this.percentagePress = this.percentagePress.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  createButton(value) {
    return <Button onClick={() => this.handleClick(value)}>{parse(value)}</Button>;
  }

  createLargeButton(value) {
    return (
      <LargeButton onClick={() => this.handleClick(value)}>
        {parse(value)}
      </LargeButton>
    );
  }

  digitPress(value) {
    this.setState((state) => {
      let newValue = state.value + value;
      if (state.isNewValue) {
        return {
          value,
          isNewValue: false,
          history: state.clearHistory ? null : state.history,
          clearHistory: false,
        };
      }
      if (isInt(+newValue) && newValue.startsWith("0")) {
        newValue = newValue.slice(1);
      }
      return {
        value: newValue,
        history: state.clearHistory ? null : state.history,
      };
    });
  }

  zeroPress(value) {
    this.setState((state) => {
      let current = state.value;
      if (current === "0") {
        return;
      }
      return {
        value: !state.isNewValue ? current + value : value === "00" ? "0" : value,
        history: state.clearHistory ? null : state.history,
        isNewValue: false,
        clearHistory: false,
      };
    });
  }

  dotPress(value) {
    this.setState((state) => {
      if (this.state.value.indexOf(".") !== -1) {
        return state;
      }
      return {
        value: state.value + value,
      };
    });
  }

  operatorPress(operator) {
    operator = operator === "*" ? "×" : operator;
    this.setState((state) => {
      let history = state.clearHistory
        ? `${state.value} ${parse(operator)}`
        : state.history
        ? `${state.history} ${state.value} ${parse(operator)}`
        : `${state.value} ${parse(operator)}`;
      return {
        history,
        isNewValue: true,
        clearHistory: false,
      };
    });
  }

  percentagePress() {
    this.setState((state) => ({
      value: state.value / 100,
    }));
  }

  resultPress() {
    let splitted = this.state.history.split(" ").concat(this.state.value);
    let isNextPressed = false;
    if (splitted.indexOf("=") !== -1) {
      splitted = splitted.slice(0, splitted.length - 2);
      splitted[0] = this.state.value.toString();
      isNextPressed = true;
    }
    console.log(splitted);
    let result = 0;
    let prev = splitted[0];
    let operator;
    for (let i = 1; i < splitted.length; i++) {
      if (i % 2 === 0) {
        result = operators[operator](+prev, +splitted[i]);
        prev = result;
      } else {
        operator = splitted[i];
      }
    }
    this.setState((state) => {
      let history;
      if (isNextPressed) {
        history = `${result} ${operator} ${splitted[splitted.length - 1]} =`;
      } else {
        history = `${state.history} ${state.value} =`;
      }
      return {
        history,
        value: result,
        isNewValue: true,
        clearHistory: true,
      };
    });
  }

  handleClick(value) {
    switch (value) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.digitPress(value);
        break;
      case "0":
      case "00":
        this.zeroPress(value);
        break;
      case ".":
        this.dotPress(value);
        break;
      case "×":
      case "÷":
      case "-":
      case "+":
        this.operatorPress(value);
        break;
      case "=":
        this.resultPress(value);
        break;
      case "%":
        this.percentagePress();
        break;
    }
  }

  handleKeyPress(event) {
    const key = event.key;
    if (isInt(key)) {
      this.digitPress(key);
    } else if (key === "0") {
      this.zeroPress(key);
    } else if (key === ".") {
      this.dotPress();
    } else if (key === "%") {
      this.percentagePress();
    } else if (key === "=" || key === "Enter") {
      this.resultPress();
    } else if (key === "/" || key === "*" || key === "-" || key === "+") {
      this.operatorPress(key);
    }
  }

  render() {
    return (
      <div className="grid grid-cols-5">
        <Display value={this.state.value} history={this.state.history} test={true} />
        {this.createButton("7")}
        {this.createButton("8")}
        {this.createButton("9")}
        {this.createButton("÷")}
        {this.createButton("%")}
        {this.createButton("4")}
        {this.createButton("5")}
        {this.createButton("6")}
        {this.createButton("×")}
        {this.createButton("-")}
        {this.createButton("1")}
        {this.createButton("2")}
        {this.createButton("3")}
        {this.createLargeButton("+")}
        {this.createLargeButton("=")}
        {this.createButton("0")}
        {this.createButton("00")}
        {this.createButton(".")}
      </div>
    );
  }
}

export default App;
