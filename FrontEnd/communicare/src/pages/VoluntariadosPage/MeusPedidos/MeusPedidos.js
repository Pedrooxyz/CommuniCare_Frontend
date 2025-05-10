import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusPedidos.css";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";

// COMPONENTE: Header com perfil e cares
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
        src={userInfo?.fotoUtil ? `http://localhost:5182/${userInfo.fotoUtil}` : iconFallback}
        width={60}
        height={60}
        alt="User"
        onError={(e) => { e.target.src = iconFallback; }}
      />
    </header>
  );
};

// COMPONENTE: Barra de busca e navegação
const Search = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mainName">
        <h1>Voluntariados</h1>
      </div>
      <div className="tabs1">
        <div className="choose1">
          <button className="tab1 active" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab1" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
        </div>
        <div className="search-wrapper1">
          <input type="text" placeholder="Pesquisar..." className="search1" />
          <FaSearch className="search-icon1" />
        </div>
      </div>
    </div>
  );
};

// COMPONENTE: Lista de pedidos com ações
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

  const getImagemSrc = (foto) => {
    return foto && foto.trim() && foto !== "null" && foto !== "string"
      ? `data:image/jpeg;base64,${foto}`
      : iconFallback;
  };

  const handleEdit = (id) => {
    navigate(`/editarPedido/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja apagar este pedido de ajuda?")) {
      try {
        const response = await api.delete(`/PedidosAjuda/${id}`);
        if (response.status === 204) {
          setPedidos((prev) => prev.filter((p) => p.idPedido !== id));
        } else {
          alert("Erro ao apagar o pedido.");
        }
      } catch (error) {
        console.error("Erro ao apagar o pedido:", error);
        alert("Erro ao apagar o pedido.");
      }
    }
  };

  return (
    <div className="cards">
      <div className="card adicionar-card" onClick={() => navigate("/pedirVoluntariado")}>
        <div className="TitleOE"><h2>Adicionar Pedido</h2></div>
        <div className="adicionarIcon">+</div>
      </div>

      {pedidos.map((pedido) => (
        <div className="card" key={pedido.idPedido}>
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
          <div className="estadoItem">
            <span>
              Estado:{" "}
              <span
                className={`estado-circle ${pedido.Estado === 0
                    ? "vermelho"
                    : pedido.Estado === 1
                      ? "amarelo"
                      : pedido.Estado === 2
                        ? "verde"
                        : ""
                  }`}
              />
          </span>
          <div className="controlesAcao">
            <button className="EditDeleteButtons" onClick={() => handleEdit(pedido.idPedido)}>
              <FaEdit />
            </button>
            <button className="EditDeleteButtons" onClick={() => handleDelete(pedido.idPedido)}>
              <FaTrash />
            </button>
          </div>
        </div>
        </div>
  ))
}
    </div >
  );
};

// COMPONENTE PRINCIPAL
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
