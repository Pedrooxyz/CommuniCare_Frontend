import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import "./OutrosPedidos.css";

// Imagens
import cares from '../../../assets/Cares.png';

const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("Utilizadores/InfoUtilizador");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header>
      <p className="ptext">{userInfo ? userInfo.numCares : "..."}</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img
        className="imgHeaderVol"
        src={userInfo ? `http://localhost:5000/${userInfo.fotoUtil}` : '../../../../assets/icon.jpg'}
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '../../../../assets/icon.jpg';
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

        // Carrega fotos dos utilizadores
        for (const pedido of response.data) {
          try {
            const fotoResponse = await api.get(`PedidosAjuda/${pedido.pedidoId}/foto-requerente`);
            const urlFoto = `http://localhost:5000/${fotoResponse.data}`;
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
              src={fotosUtilizadores[pedido.pedidoId] || '../../../../assets/icon.jpg'}
              width={70}
              height={70}
              alt="User"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '../../../../assets/icon.jpg';
              }}
            />
            <h2>{pedido.tituloPedido}</h2>
          </div>
          <img className="imgPedidos" src={pedido.fotografiaPedido} alt={pedido.tituloPedido} />

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
