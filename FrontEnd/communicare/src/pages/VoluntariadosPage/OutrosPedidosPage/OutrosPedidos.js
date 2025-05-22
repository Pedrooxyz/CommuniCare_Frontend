import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./OutrosPedidos.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

// Imagens
import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";


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

const getImagemSrc = (foto) => {
  return foto && foto.trim() && foto !== "null" && foto !== "string"
    ? `data:image/jpeg;base64,${foto}`
    : iconFallback;
};

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [fotosUtilizadores, setFotosUtilizadores] = useState({});
  const navigate = useNavigate();

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
          <div className="TitleOE">
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
          />
          <div className="desc">
            <h4 className="descP">{pedido.descPedido || "Sem descrição."}</h4>
          </div>
          <div className="infoExtraPedido">
            <div className="infoBox">
              <span className="icon">&#128100;</span>
              <span>{pedido.nPessoas}</span>
            </div>
            <div className="infoBox">
              <span className="icon">{pedido.recompensaCares}</span>
              <img src={cares} alt="Cares" className="caresIcon" />
            </div>
          </div>

          {/* Botão Mais detalhes */}
          <div className="voluntariarButtonWrapper">
            <button
              className="voluntariarButton"
              onClick={() => navigate(`/maisInfoPedidos/${pedido.pedidoId}`)}
            >
              Mais Informações
            </button>
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
