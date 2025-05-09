import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import "./OutrosPedidos.css";

// Imagens
import cares from '../../../assets/Cares.png';
import iconFallback from '../../../assets/icon.jpg';

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
const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mainName">
        <h1>Voluntariados</h1>
      </div>

      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusPedidos")}>Meus Pedidos</button>
          <button className="tab active" onClick={() => navigate("/outrosPedidos")}>Outros Pedidos</button>
          <button className="tab" onClick={() => navigate("/pendentesPedidos")}>Pedidos Pendentes</button>
        </div>

        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [fotosUtilizadores, setFotosUtilizadores] = useState({});

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("PedidosAjuda/PedidosDisponiveis");
        setPedidos(response.data);

        for (const pedido of response.data) {
          try {
            const fotoResponse = await api.get(`PedidosAjuda/${pedido.pedidoId}/foto-requerente`);
            const urlFoto = `http://localhost:5182/${fotoResponse.data}`;
            setFotosUtilizadores(prev => ({
              ...prev,
              [pedido.pedidoId]: urlFoto
            }));
          } catch (error) {
            console.error(`Erro ao carregar foto do utilizador ${pedido.pedidoId}`, error);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos disponíveis:", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="cards">
      {pedidos.map((pedido) => (
        <div className="card" key={pedido.pedidoId}>
          <div className="userTitle">
            <img
              className="imgUsers"
              src={fotosUtilizadores[pedido.pedidoId] || iconFallback}
              width={70}
              height={70}
              alt="User"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
            />
            <h2>{pedido.tituloPedido}</h2>
          </div>
          <img
            className="imgPedidos"
            src={
              pedido.fotografiaPedido && pedido.fotografiaPedido.trim() !== ""
                ? `http://localhost:5182/${pedido.fotografiaPedido}`
                : iconFallback
            }
            alt={pedido.tituloPedido}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />

          <p className="ptext">{pedido.descPedido || "Sem descrição disponível."}</p>

          <div className="infoPedido">
            <span>👤 {pedido.numVoluntarios}</span>
            <span><img src={cares} width={30} height={30} alt="Cares" /> {pedido.pontuacao}</span>
          </div>
          <div className="datetime">
            <span>🕒 {pedido.horaPedido}</span>
            <span>📅 {pedido.dataPedido}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

function OutrosPedidos() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaPedidos />
    </>
  );
}

export default OutrosPedidos;