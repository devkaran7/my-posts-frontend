import React from "react";
import "./Modal.css";
import Card from "./Card";
import BackDrop from "./BackDrop";

const Modal = (props) => {
  return (
    <>
      <BackDrop />
      <Card className="modal-container" style={props.style}>
        {props.children}
        <div className="modal-btn-control">
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
          <button
            className="btn"
            style={{ backgroundColor: props.buttonColor }}
            onClick={props.onConfirm}
          >
            {props.buttonTitle}
          </button>
        </div>
      </Card>
    </>
  );
};

export default Modal;
