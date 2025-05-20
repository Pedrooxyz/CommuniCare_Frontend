import React from "react";
import cares from "../assets/Cares.png"; // ajusta conforme tua estrutura
import iconFallback from "../assets/icon.jpg"; // ajusta conforme tua estrutura
import { api } from './axios.js';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const HeaderProfileCares = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header>
      <p style={{ textAlign: "center" }}>
        {userInfo ? userInfo.numCares : "..."}
      </p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img
        className="imgHeaderVol"
        onClick={() => navigate(`/profile`)}
        src={
          userInfo && userInfo.fotoUtil
            ? `http://localhost:5182/${userInfo.fotoUtil}`
            : iconFallback
        }
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = iconFallback;
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          margin: "5px",
          cursor: "pointer",
          borderRadius: "50%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          boxShadow: isHovered ? "0 0 10px rgba(0,0,0,0.3)" : "none",
        }}
      />
    </header>
  );
};

export default HeaderProfileCares;
