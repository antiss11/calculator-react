import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="border-2 border-l-pink-500 p-5 text-8xl col-span-5 flex flex-wrap">
        <small className="basis-full text-right text-base h-4">
          {this.props.history}
        </small>
        <output className="basis-full text-right text-8xl">
          {this.props.value}
        </output>
      </div>
    );
  }
}
