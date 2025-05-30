import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../../components/ToastBar/ToastBar.js"; // Import ToastBar
import "./MaisInfoPedidos.css";
import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';

const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return iconFallback;
  }
};

const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);
  const [toast, setToast] = useState(null); // Estado para o ToastBar

  useEffect(() => {
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

    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/pendentesPedidos");
    } else {
      setToast({
        message: "Apenas administradores podem aceder a esta página!",
        type: "error",
      });
    }
  };

  return (
    <div>
      <div className="mainNameMI1">
        <h1>Voluntariados</h1>
      </div>
      <div className="tabsMIOP">
        <div className="chooseMIOP">
          <button className="tabMIOP" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tabMIOP active" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tabMIOP" onClick={handleClickPendentes}>
              Pedidos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapperMIOP">
          <input type="text" placeholder="Pesquisar..." className="search1" />
          <FaSearch className="search-iconMIOP" />
        </div>
      </div>
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const DetalhesItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    titulo: "",
    descPedido: "",
    recompensaCares: 0,
    fotografiaPA: "",
    nPessoas: 0,
    utilizadorId: null,
  });
  const [fotoDono, setFotoDono] = useState(iconFallback);
  const [toast, setToast] = useState(null); // Estado para o ToastBar

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/PedidosAjuda/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setItem({
          titulo: data.titulo ?? "",
          descPedido: data.descPedido ?? "",
          recompensaCares: data.recompensaCares ?? 0,
          fotografiaPA: data.fotografiaPA ?? "",
          nPessoas: data.nPessoas ?? 0,
          utilizadorId: data.utilizadorId,
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        setToast({
          message: "Erro ao carregar os detalhes do pedido.",
          type: "error",
        });
      }
    };

    const fetchFotoDono = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`PedidosAjuda/${id}/foto-dono`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.trim() && response.data !== "null") {
          setFotoDono(`http://localhost:5182/${response.data}`);
        } else {
          setFotoDono(iconFallback);
        }
      } catch (error) {
        console.error(`Erro ao buscar foto do dono para pedido ${id}:`, error);
        setFotoDono(iconFallback);
      }
    };

    fetchItem();
    fetchFotoDono();
  }, [id]);

  const voluntariar = async (pedidoId) => {
    if (!pedidoId) {
      console.error("pedidoId não fornecido");
      setToast({
        message: "Erro: ID do pedido não fornecido.",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/PedidosAjuda/${pedidoId}/Voluntariar`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        message: response.data,
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao se voluntariar:", error);
      setToast({
        message: error.response?.data ? `Erro: ${error.response.data}` : "Erro ao se voluntariar para o pedido.",
        type: "error",
      });
    }
  };

  return (
    <div className="detalhesContainerMIOP">
      <div className="colunaEsquerdaMIOP">
        <div className="userTitleMD">
          <img
            className="imgUsers"
            src={fotoDono}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
            alt="Foto do dono"
            width={70}
            height={70}
            style={{ cursor: "pointer" }}
            onClick={() => item.utilizadorId && navigate(`/PerfilOutroUtilizador/${item.utilizadorId}`)}
          />
          <h2 className="tituloItem">{item.titulo}</h2>
        </div>

        <img
          className="imgItemDetalhesMIOP"
          src={getImagemSrc(item.fotografiaPA)}
          alt={item.titulo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = iconFallback;
          }}
        />

        <div className="infoItemIMIOP detalhes">
          <div className="infoBoxMIOP">
            <span>👤</span>
            <span>{item.nPessoas}</span>
          </div>
          <div className="infoBoxMIOP">
            <span>{item.recompensaCares}</span>
            <img src={cares} width={40} height={40} alt="Cares" />
          </div>
          <button className="botaoAdquirirMIOP" onClick={() => voluntariar(id)}>
            Voluntariar
          </button>
        </div>
      </div>

      <div className="colunaDireitaMIOP">
        <h2 className="tituloItem">Detalhes</h2>
        <div className="caixaDescricao">{item.descPedido}</div>
      </div>

      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

function MaisInformacoes() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <DetalhesItem />
    </>
  );
}

export default MaisInformacoes;