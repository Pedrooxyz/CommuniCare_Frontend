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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("PedidosAjuda/PedidosDisponiveis");
        const pedidosData = response.data;

        // Buscar as fotos do dono
        const pedidosWithPhotos = await Promise.all(
          pedidosData.map(async (pedido) => {
            try {
              const fotoResponse = await api.get(`PedidosAjuda/${pedido.pedidoId}/foto-dono`);
              return {
                ...pedido,
                fotoDono: fotoResponse.data && fotoResponse.data.trim() && fotoResponse.data !== "null"
                  ? `http://localhost:5182/${fotoResponse.data}`
                  : iconFallback,
              };
            } catch (error) {
              console.error(`Erro ao buscar foto do dono para pedido ${pedido.pedidoId}:`, error);
              return { ...pedido, fotoDono: iconFallback };
            }
          })
        );

        setPedidos(pedidosWithPhotos);
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
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={pedido.fotoDono}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do dono"
              width={70}
              height={70}
            />
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
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
