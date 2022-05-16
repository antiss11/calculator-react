import React from "react";

class Button extends React.Component {
  render() {
    return (
      <button
        className="text-4xl row-span-1 col-span-1 border-2 border-black"
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

class LargeButton extends React.Component {
  render() {
    return (
      <button
        className="text-4xl row-span-2 col-span-1 border-2 border-black"
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
}

export { Button, LargeButton };
