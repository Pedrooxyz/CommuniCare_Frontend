import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../../components/ToastBar/ToastBar.js"; // Import ToastBar
import "./MaisInfoPedidosPendentes.css";
import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';

const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null") {
    return `data:image/jpeg;base64,${fotoItem}`;
  }
  return iconFallback;
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
        setToast({
          message: "Erro ao verificar o tipo de utilizador.",
          type: "error",
        });
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
        <h1>Pedidos Ajuda</h1>
      </div>
      <div className="tabs1">
        <div className="choose1">
          <button className="tab1" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab1 active" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab1" onClick={handleClickPendentes}>
              Pedidos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapper1">
          <input type="text" placeholder="Pesquisar..." className="search1" />
          <FaSearch className="search-icon1" />
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState({
    titulo: "",
    descPedido: "",
    recompensaCares: 0,
    fotografiaPA: "",
    nPessoas: 0,
  });
  const [fotoDono, setFotoDono] = useState(iconFallback);
  const [isLoadingFoto, setIsLoadingFoto] = useState(true);
  const [toast, setToast] = useState(null); // Estado para o ToastBar

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/PedidosAjuda/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Resposta da API (detalhes):", response.data);

        const data = response.data;
        setItem({
          titulo: data.titulo ?? "",
          descPedido: data.descPedido ?? "",
          recompensaCares: data.recompensaCares ?? 0,
          fotografiaPA: data.fotografiaPA ?? "",
          nPessoas: data.nPessoas,
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
        const response = await api.get(`/PedidosAjuda/${id}/foto-dono`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Resposta da API (foto-dono):", response.data);

        if (response.data && response.data.trim() !== "" && response.data !== "null") {
          const urlFoto = `http://localhost:5182/${response.data}`;
          setFotoDono(urlFoto);
        } else {
          setFotoDono(iconFallback);
        }
      } catch (error) {
        console.error('Erro ao buscar foto do dono:', error);
        setFotoDono(iconFallback);
        setToast({
          message: "Erro ao carregar a foto do dono.",
          type: "error",
        });
      } finally {
        setIsLoadingFoto(false);
      }
    };

    fetchItem();
    fetchFotoDono();
  }, [id]);

  const validarPedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/PedidosAjuda/${pedidoId}/ValidarPedido-(admin)`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToast({
        message: response.data,
        type: "success",
      });
      setTimeout(() => navigate("/outrosPedidos"), 3000);
    } catch (error) {
      console.error("Erro ao validar pedido:", error);
      setToast({
        message: error.response?.data ? `Erro: ${error.response.data}` : "Erro ao validar o pedido.",
        type: "error",
      });
    }
  };

  const rejeitarPedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/PedidosAjuda/${pedidoId}/RejeitarPedido-(admin)`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToast({
        message: "Pedido rejeitado com sucesso!",
        type: "success",
      });
      setTimeout(() => navigate("/outrosPedidos"), 3000);
    } catch (error) {
      console.error("Erro ao rejeitar pedido:", error);
      setToast({
        message: error.response?.data ? `Erro: ${error.response.data}` : "Erro ao rejeitar o pedido.",
        type: "error",
      });
    }
  };

  return (
    <div className="detalhesContainer">
      <div className="colunaEsquerdaMI">
        <div className="userTitleMD">
          <img
            className="imgUsers"
            src={isLoadingFoto ? iconFallback : fotoDono}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
            alt="Foto do dono"
            width={70}
            height={70}
          />
          <h2 className="tituloItem">{item.titulo}</h2>
        </div>

        <img
          className="imgItemDetalhesMI"
          src={getImagemSrc(item.fotografiaPA)}
          alt={item.titulo}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = iconFallback;
          }}
        />

        <div className="infoItemI detalhes">
          <div className="infoExtraPedido">
            <div className="infoBox">
              <span className="icon">👤</span>
              <span>{item.nPessoas}</span>
            </div>
            <div className="infoBox">
              <span className="icon">{item.recompensaCares}</span>
              <img src={cares} width={30} height={30} alt="Cares" className="caresIcon" />
            </div>
          </div>
          <div className="buttonGroup">
            <button className="botaoValidar" onClick={() => validarPedido(id)}>
              Validar
            </button>
            <button className="botaoRejeitar" onClick={() => rejeitarPedido(id)}>
              Rejeitar
            </button>
          </div>
        </div>
      </div>

      <div className="colunaDireitaMI">
        <h2 className="tituloItem">Detalhes</h2>
        <div className="caixaDescricao">
          {item.descPedido}
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