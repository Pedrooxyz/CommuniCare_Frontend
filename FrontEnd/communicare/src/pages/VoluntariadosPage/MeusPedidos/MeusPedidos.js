import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusPedidos.css";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";

const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/InfoUtilizador", {
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

const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mainName">
        <h1>Pedidos de Ajuda</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab active" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
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

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get("/PedidosAjuda/MeusPedidos");
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

const getImagemSrc = (fotoPedido) => {
  if (
    fotoPedido &&
    fotoPedido.trim() !== "" &&
    fotoPedido !== "null" &&
    fotoPedido !== "string"
  ) {
    return `data:image/jpeg;base64,${fotoPedido}`;
  } else {
    return iconFallback;
  }
};


  const handleEdit = (pedidoId) => {
    navigate(`/editarPedido/${pedidoId}`);
  };

  const handleDelete = async (pedidoId) => {
    if (window.confirm("Deseja apagar este pedido de ajuda?")) {
      try {
        const response = await api.delete(`/PedidosAjuda/${pedidoId}`);
        if (response.status === 204) {
          setPedidos((prev) => prev.filter((p) => p.idPedido !== pedidoId));
        } else {
          alert("Erro ao apagar o pedido.");
        }
      } catch (error) {
        console.error("Erro ao apagar o pedido:", error.response || error);
        alert("Erro ao apagar o pedido.");
      }
    }
  };

  return (
    <div className="cards">
      <div
        className="card adicionar-card"
        onClick={() => navigate("/pedirVoluntariado")}
        style={{ cursor: "pointer" }}
      >
        <div className="TitleOE">
          <h2>Adicionar Pedido</h2>
        </div>
        <div
          className="adicionarIcon"
          style={{ fontSize: "100px", textAlign: "center", marginTop: "190px" }}
        >
          +
        </div>
      </div>

      {pedidos.map((pedido, index) => (
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
            <div className="controlesAcao">
              <button
                className="EditDeleteButtons"
                onClick={() => handleEdit(pedido.idPedido)}
              >
                <FaEdit />
              </button>
              <button
                className="EditDeleteButtons"
                onClick={() => handleDelete(pedido.idPedido)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function MeusPedidos() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaPedidos />
    </>
  );
}

export default MeusPedidos;
