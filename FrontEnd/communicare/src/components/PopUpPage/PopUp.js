import React, { useState } from "react";
import "./PopUp.css";


export const PopUp = ({message, onClose}) => {
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





export const PopUpBarra = ({ maxCares, onClose }) => {
  const [valor, setValor] = useState(maxCares || 1000); 

  const handleConcluir = () => {
    localStorage.setItem("valorMaxCares", valor);
    onClose(valor); 
  };

  return (
    <>
      <div className="popupFundo" onClick={() => onClose()} />
      <div className="popupAviso">
        <p>Máximo de Cares:</p>
        <input
          type="range"
          min="0"
          max="2000"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <p>{valor} cares</p>
        <div className="popupFooter">
          <button onClick={handleConcluir}>Concluído</button>
        </div>
      </div>
    </>
  );
};


