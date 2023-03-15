import React, { useState } from "react";
import "./FormInput.css";
import { validate } from "../utils/Validators";

const FormInput = (props) => {
  const { label, errorMessage, validators, onChange, isvalid, ...inputProps } =
    props;

  const [isValid, setIsValid] = useState(isvalid);
  const [touched, setTouched] = useState(false);

  const errorStyles = {
    backgroundColor: "rgb(253, 173, 164)",
    outline: "1px solid red",
    color: "red",
  };

  const textChangeHandler = (event) => {
    const tempValid = validate(event.target.value, validators);
    setIsValid(tempValid);
    onChange(event, tempValid);
  };

  const blurHandler = () => {
    setTouched(true);
  };

  let element = (
    <input
      {...inputProps}
      style={touched && !isValid ? errorStyles : undefined}
      onBlur={blurHandler}
      onChange={textChangeHandler}
      id={props.name}
    />
  );

  if (inputProps.type === "text-area") {
    element = (
      <textarea
        {...inputProps}
        onChange={textChangeHandler}
        onBlur={blurHandler}
        rows="3"
        style={touched && !isValid ? errorStyles : undefined}
        id={props.name}
      ></textarea>
    );
  }
  return (
    <div className="formInput">
      <label htmlFor={props.name}>{label}</label>
      <div className="formInput-container">
        {element}
        {touched && !isValid && (
          <span style={{ color: "red" }}>{errorMessage}</span>
        )}
      </div>
    </div>
  );
};

export default FormInput;
