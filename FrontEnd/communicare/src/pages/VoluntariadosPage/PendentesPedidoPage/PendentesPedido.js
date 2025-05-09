import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./PendentesPedido.css";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";

// Header com informações do utilizador
const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/InfoUtilizador", {
          headers: { Authorization: `Bearer ${token}` },
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
      />
    </header>
  );
};

// Tabs e Pesquisa
const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mainName">
        <h1>Pedidos Pendentes</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          <button className="tab active" onClick={() => navigate("/pendentesPedidos")}>
            Pedidos Pendentes
          </button>
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

// Lista de Pedidos Pendentes
const ListaPedidosPendentes = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendentes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/PedidosAjuda/Admin/Pendentes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos pendentes:", error);
      }
    };

    fetchPendentes();
  }, []);

  const getImagemSrc = (fotoPedido) => {
    return fotoPedido && fotoPedido.trim() !== "" && fotoPedido !== "null"
      ? `http://localhost:5182/${fotoPedido}`
      : iconFallback;
  };

  return (
    <div className="cards">
      {pedidos.length === 0 ? (
        <p style={{ textAlign: "center", width: "100%" }}>
          Nenhum pedido pendente encontrado.
        </p>
      ) : (
        pedidos.map((pedido, index) => (
          <div className="card" key={pedido.idPedido || index}>
            <div className="TitleOE">
              <h2>{pedido.titulo}</h2>
            </div>
            <img
              className="imgItemOE"
              src={getImagemSrc(pedido.fotografiaPA)}
              alt={pedido.titulo}
            />
            <p>{pedido.descPedido || "Sem descrição."}</p>
            <div className="estadoItem">
              <div>
                <span className="estado">
                  Estado:{" "}
                  <span
                    className={`estado-circle ${
                      pedido.estado === "Ativo" ? "disponivel" : "emprestado"
                    }`}
                  ></span>
                </span>
              </div>
              <div className="moreInfo">
                <button onClick={() => navigate(`/pendentePedidoInfo/${pedido.idPedido}`)}>
                  Mais Informações
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Página principal
function PendentesPedidos() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaPedidosPendentes />
    </>
  );
}

export default PendentesPedidos;
