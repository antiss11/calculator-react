import Button from "./Button";
import Display from "./Display";
import React from "react";
import parse from "html-react-parser";
import { operators, isInt } from "./operations";

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
    this.backspacePress = this.backspacePress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    document.body.className = "bg-sky-300";
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  createButton(value, classes) {
    return (
      <Button onClick={() => this.handleClick(value)} className={classes}>
        {parse(value)}
      </Button>
    );
  }

  backspacePress() {
    this.setState((state) => {
      const current = state.value;
      return {
        value:
          current === "0"
            ? "0"
            : current.length === 1
            ? "0"
            : state.clearHistory
            ? current
            : current.slice(0, -1),
        history: state.clearHistory ? null : state.history,
      };
    });
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
      if (state.value.indexOf(".") !== -1) {
        return;
      }
      return {
        value: state.clearHistory ? `0.` : state.value + value,
        history: state.clearHistory ? null : state.history,
        clearHistory: false,
        isNewValue: false,
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
    if (!this.state.history) return;
    let splitted = this.state.history.split(" ").concat(this.state.value);
    let isNextPressed = false;
    if (splitted.indexOf("=") !== -1) {
      splitted = splitted.slice(0, splitted.length - 2);
      splitted[0] = this.state.value.toString();
      isNextPressed = true;
    }
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
      case "&#9003;":
        this.backspacePress();
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
      this.dotPress(key);
    } else if (key === "%") {
      this.percentagePress();
    } else if (key === "=" || key === "Enter") {
      this.resultPress();
    } else if (key === "/" || key === "*" || key === "-" || key === "+") {
      this.operatorPress(key);
    } else if (key === "Backspace") {
      this.backspacePress();
    }
  }

  render() {
    return (
      <div className="grid grid-cols-5 h-screen md:mx-10 lg:mx-40 xl:mx-96 gap-0.5 bg-neutral-900/100">
        <Display value={this.state.value} history={this.state.history} test={true} />
        {this.createButton(
          "&#9003;",
          "row-span1 col-span-5 bg-orange-500 text-white"
        )}
        {this.createButton("7")}
        {this.createButton("8")}
        {this.createButton("9")}
        {this.createButton("÷", "bg-orange-500 text-white")}
        {this.createButton("%", "bg-orange-500 text-white")}
        {this.createButton("4")}
        {this.createButton("5")}
        {this.createButton("6")}
        {this.createButton("×", "bg-orange-500 text-white")}
        {this.createButton("-", "bg-orange-500 text-white")}
        {this.createButton("1")}
        {this.createButton("2")}
        {this.createButton("3")}
        {this.createButton("+", "row-span-2 col-span-1 bg-orange-500 text-white")}
        {this.createButton("=", "row-span-2 col-span-1 bg-orange-500 text-white")}
        {this.createButton("0")}
        {this.createButton("00")}
        {this.createButton(".")}
      </div>
    );
  }
}

export default App;
