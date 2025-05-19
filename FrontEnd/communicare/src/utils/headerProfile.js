import React from "react";
import cares from "../assets/Cares.png"; // ajusta conforme tua estrutura
import iconFallback from "../assets/icon.jpg"; // ajusta conforme tua estrutura

const HeaderProfileCares = ({ userInfo }) => {
  return (
    <header>
      <p style={{ textAlign: "center" }}>
        {userInfo ? userInfo.numCares : "..."}
      </p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img
        className="imgHeaderVol"
        src={userInfo?.fotoUtil ? `http://localhost:5182/${userInfo.fotoUtil}` : iconFallback}
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = iconFallback;
        }}
      />
    </header>
  );
};

export default HeaderProfileCares;
