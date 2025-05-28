import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./OutrosPedidos.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

// Imagens
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
          <button className="tab" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab active" onClick={() => navigate("/outrosPedidos")}>
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
    <div className="cardsOE">
      {pedidos.map((pedido) => (
        <div className="cardOE" key={pedido.pedidoId}>
          <div className="userTitleOP">
            <img
              className="imgUsersOP"
              src={pedido.fotoDono}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do dono"
              width={70}
              height={70}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/PerfilOutroUtilizador/${pedido.utilizadorId}`)} // Redireciona para o perfil do dono
            />
            <h2>{pedido.titulo}</h2>
          </div>
          <img
            className="imgItemOP"
            src={getImagemSrc(pedido.fotografiaPA)}
            alt={pedido.titulo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <div className="descOP">
            <h4 className="descoP">{pedido.descPedido || "Sem descrição."}</h4>
          </div>
          <div className="infoExtraPedidoOP">
            <div className="infoBoxOP">
              <span className="iconOP">&#128100;</span>
              <span>{pedido.nPessoas}</span>
            </div>
            <div className="infoBoxOP">
              <span className="iconOP">{pedido.recompensaCares}</span>
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
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HeaderProfileCares />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ListaPedidos />
    </>
  );
}

export default OutrosPedidos;