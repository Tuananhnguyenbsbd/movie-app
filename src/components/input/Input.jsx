import React from "react";
import "./input.scss";
const Input = (props) => {
    return (
        <input
            placeholder={props.placeholder}
            type={props.type}
            value={props.value}
            onChange={props.onChange ? (e) => props.onChange(e) : null}
        ></input>
    );
};
export default Input;
