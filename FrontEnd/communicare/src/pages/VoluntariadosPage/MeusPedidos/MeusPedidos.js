import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusPedidos.css";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";


const HeaderProfileCares = () => {
  const navigate = useNavigate();
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
        onClick={() => navigate(`/profile`)}
        src={userInfo?.fotoUtil ? `http://localhost:5182/${userInfo.fotoUtil}` : iconFallback}
        width={60}
        height={60}
        alt="User"
        onError={(e) => { e.target.src = iconFallback; }}
      />
    </header>
  );
};


const Search = ({ setSearchTerm }) => {
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
          <button className="tab" onClick={() => navigate("/pendentesPedidos")}>Pedidos Pendentes</button>
        </div>
        <div className="search-wrapper1">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search1"
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <FaSearch className="search-icon1" />
        </div>
      </div>
    </div>
  );
};


const ListaPedidos = ({ pedidos, searchTerm, setPedidos }) => {
  const navigate = useNavigate();

  // Filtra apenas pelos títulos dos pedidos
  const filteredPedidos = pedidos.filter((pedido) => {
    const titulo = pedido.titulo ? pedido.titulo.toLowerCase() : '';
    return titulo.includes(searchTerm.toLowerCase());
  });

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

  const handleConcluir = async (id) => {
    if (window.confirm("Deseja concluir este pedido?")) {
      try {
        const response = await api.post(`/PedidosAjuda/ConcluirPedido/${id}`);
        if (response.status === 200) {
          
          setPedidos((prev) =>
            prev.map((p) =>
              p.idPedido === id ? { ...p, estado: 4 } : p
            )
          );
        } else {
          alert("Erro ao concluir o pedido.");
        }
      } catch (error) {
        console.error("Erro ao concluir o pedido:", error);
        alert("Erro ao concluir o pedido.");
      }
    }
  };

  return (
    <div className="cards">
      <div className="card adicionar-card" onClick={() => navigate("/pedirVoluntariado")}>
        <div className="TitleOE"><h2>Adicionar Pedido</h2></div>
        <div className="adicionarIcon">+</div>
      </div>

      {filteredPedidos.map((pedido) => (
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
                className={`estado-circle ${pedido.estado === 0
                  ? "amarelo"
                  : pedido.estado === 1
                    ? "verde"
                    : pedido.estado === 2
                      ? "azul"
                      : pedido.estado === 3
                        ? "vermelho"
                        : ""
                  }`}
              />
            </span>
            <div className="controlesAcao">
              {(pedido.estado === 0 || pedido.estado === 1) && (
                <>
                  <button className="EditDeleteButtons" onClick={() => handleEdit(pedido.idPedido)}>
                    <FaEdit />
                  </button>
                  <button className="EditDeleteButtons" onClick={() => handleDelete(pedido.idPedido)}>
                    <FaTrash />
                  </button>
                </>
              )}
              {pedido.estado === 2 && (
                <button onClick={() => handleConcluir(pedido.idPedido)} className="concluir-button">
                  Concluir
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// COMPONENTE PRINCIPAL
function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <>
      <HeaderProfileCares />
      <Search setSearchTerm={setSearchTerm} />
      <ListaPedidos pedidos={pedidos} searchTerm={searchTerm} setPedidos={setPedidos} />
    </>
  );
}

export default MeusPedidos;
