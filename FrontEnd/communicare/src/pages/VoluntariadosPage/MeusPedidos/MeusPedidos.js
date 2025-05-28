import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusPedidos.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";



const Search = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

  const verificarTipoUtilizador = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/Utilizadores/VerificarAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserTipoUtilizadorId(response.data);
    } catch (error) {
      console.error("Erro ao verificar o tipo de utilizador", error);
      setUserTipoUtilizadorId(false);
    }
  };

  useEffect(() => {
    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/pendentesPedidos");
    } else {
      alert("Apenas administradores podem aceder a esta página!");
    }
  };

  return (
    <div>
      <div className="mainName">
        <h1>Voluntariados</h1>
      </div>

      <div className="tabs">
        <div className="choose">
          <button className="tab active" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab" onClick={handleClickPendentes}>
              Pedidos Pendentes
            </button>
          )}
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
          <FaSearch className="search-icon" />
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
        const response = await api.delete(`/PedidosAjuda/ApagarPedido/${id}`);
        if (response.status === 204) {
          setPedidos((prev) => prev.filter((p) => p.pedidoId !== id));
          alert("Pedido apagado com sucesso!"); 
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
              p.pedidoId === id ? { ...p, estado: 4 } : p
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
    <div className="cardsMP">
      <div className="cardMP adicionar-card" onClick={() => navigate("/pedirVoluntariado")}>
        <div className="TitleOE"><h2>Adicionar Pedido</h2></div>
        <div className="adicionarIcon">+</div>
      </div>

      {filteredPedidos.map((pedido) => (
        <div className="cardMP" key={pedido.pedidoId}>
          <div className="TitleMP">
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemMP"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
          />
          <div className="descMP">
            <h4 className="descmP">{pedido.descPedido || "Sem descrição."}</h4>
          </div>
          <div className="infoExtraPedidoMP">
            <div className="infoBoxMP">
              <span className="iconMP">&#128100;</span>
              <span>{pedido.nPessoas}</span>
            </div>
            <div className="infoBoxMP">
              <span className="iconMP">{pedido.recompensaCares}</span>
              <img src={cares} alt="Cares" className="caresIconMP" />
            </div>
          </div>
          <div className="estadoItemMP">
            <span>
              Estado:{" "}
              <span
                className={`estado-circlo ${pedido.estado === 0
                  ? "amarelo"
                  : pedido.estado === 1
                    ? "verde"
                    : pedido.estado === 2
                      ? "azul"
                      : pedido.estado === 3
                        ? "vermelho"
                        : ""
                  }`}
              >
                {pedido.estado === 0 && "Pendente"}
                {pedido.estado === 1 && "Disponível"}
                {pedido.estado === 2 && "Progresso"}
                {pedido.estado === 3 && "Concluído"}
              </span>

            </span>
            <div className="controlesAcao">
              {(pedido.estado === 0 || pedido.estado === 1) && (
                <>
                  <button className="EditDeleteButtons" onClick={() => handleEdit(pedido.pedidoId)}>
                    <FaEdit />
                  </button>
                  <button className="EditDeleteButtons" onClick={() => handleDelete(pedido.pedidoId)}>
                    <FaTrash />
                  </button>
                </>
              )}
              {pedido.estado === 2 && (
                <button onClick={() => handleConcluir(pedido.pedidoId)} className="concluir-button">
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
