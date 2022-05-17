import React from "react";

const Button = (props) => (
  <button
    className={"text-4xl bg-white active:bg-red-400 " + props.className}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export default Button;
