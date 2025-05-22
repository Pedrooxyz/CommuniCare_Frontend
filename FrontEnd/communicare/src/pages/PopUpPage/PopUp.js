import React from "react";
import "./PopUp.css";

const PopUp = ({ message, onClose }) => {
  return (
    <>
      <div className="popupFundo" onClick={onClose} />
      <div className="popupAviso">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </>
  );
};

export default PopUp;