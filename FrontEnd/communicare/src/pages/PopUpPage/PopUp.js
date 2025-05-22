import React, { useState } from "react";
import "./PopUp.css";

const PopUp = ({ message, onClose }) => {
  const [naoMostrar, setNaoMostrar] = useState(false);

  const handleFechar = () => {
    if (naoMostrar) {
      localStorage.setItem("popupLoginEscondido", "true");
    }
    onClose();
  };

  return (
    <>
      <div className="popupFundo" onClick={handleFechar} />
      <div className="popupAviso">
        <p>{message}</p>
        <div className="popupFooter">
          <label className="popupCheckbox">
            <input
              type="checkbox"
              checked={naoMostrar}
              onChange={(e) => setNaoMostrar(e.target.checked)}
            />
            Não mostrar novamente
          </label>
          <button onClick={handleFechar}>OK</button>
        </div>
      </div>
    </>
  );
};

export default PopUp;
