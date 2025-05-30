import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../../components/ToastBar/ToastBar.js"; // Import ToastBar
import "./MaisInfoValidarVoluntario.css";
import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';

const getImagemSrc = (foto) => {
  return foto && foto.trim() && foto !== "null" && foto !== "string"
    ? `data:image/jpeg;base64,${foto}`
    : iconFallback;
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
  const [voluntarios, setVoluntarios] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [voluntarioSelecionado, setVoluntarioSelecionado] = useState(null);
  const { id } = useParams();
  const [item, setItem] = useState({
    titulo: "",
    descPedido: "",
    recompensaCares: 0,
    fotografiaPA: "",
    nPessoas: 0,
  });
  const [fotoEmprestador, setFotoEmprestador] = useState(null);
  const [toast, setToast] = useState(null); // Estado para o ToastBar

  const abrirPopup = (voluntario) => {
    setVoluntarioSelecionado(voluntario);
    setShowPopup(true);
  };

  const fecharPopup = () => {
    setVoluntarioSelecionado(null);
    setShowPopup(false);
  };

  const fetchVoluntarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/PedidosAjuda/pedido/${id}/voluntarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVoluntarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar voluntários:', error);
      setToast({
        message: "Erro ao carregar a lista de voluntários.",
        type: "error",
      });
    }
  };

  const validarVoluntario = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/Voluntariados/pedidos/${id}/voluntarios/${voluntarioSelecionado.utilizadorId}/aceitar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        message: "Voluntário validado com sucesso.",
        type: "success",
      });
      setTimeout(() => {
        fecharPopup();
        fetchVoluntarios();
      }, 3000);
    } catch (error) {
      console.error("Erro ao validar:", error);
      setToast({
        message: "Erro ao validar o voluntário.",
        type: "error",
      });
    }
  };

  const rejeitarVoluntario = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/Voluntariados/pedidos/${id}/voluntarios/${voluntarioSelecionado.utilizadorId}/rejeitar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        message: "Voluntário rejeitado com sucesso.",
        type: "success",
      });
        fecharPopup();
        fetchVoluntarios();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      setToast({
        message: "Erro ao rejeitar o voluntário.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/PedidosAjuda/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      }
    };

    const fetchFotoEmprestador = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItensEmprestimo/${id}/foto-emprestador`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const urlFoto = `http://localhost:5182/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(null);
        setToast({
          message: "Erro ao carregar a foto do emprestador.",
          type: "error",
        });
      }
    };

    fetchItem();
    fetchFotoEmprestador();
    fetchVoluntarios();
  }, [id]);

  return (
    <div className="detalhesContainer">
      <div className="colunaEsquerdaMI">
        <div className="userTitleMD">
          <img
            className="imgUsers"
            src={fotoEmprestador || iconFallback}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
            alt="User"
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
          <div className="infoExtraPedidoV">
            <div className="infoBox">
              <span className="icon">👤</span>
              <span>{item.nPessoas}</span>
            </div>
            <div className="infoBox">
              <span className="icon">{item.recompensaCares}</span>
              <img src={cares} width={30} height={30} alt="Cares" className="caresIcon" />
            </div>
          </div>
        </div>
      </div>

      <div className="colunaDireitaMI">
        <h2 className="tituloItem">Voluntários</h2>
        <div className="listaVoluntarios">
          {voluntarios.length > 0 ? (
            voluntarios.map((vol, index) => (
              <div key={index} className="voluntarioBox">
                <span>{vol.nome}</span>
                <button
                  className="avaliarBtn"
                  onClick={() => abrirPopup(vol)}
                >
                  Avaliar
                </button>
              </div>
            ))
          ) : (
            <p>Nenhum voluntário encontrado.</p>
          )}
        </div>
      </div>

      {showPopup && voluntarioSelecionado && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={fecharPopup}>×</button>
            <h3>Avaliar {voluntarioSelecionado.nome}</h3>
            <p>Deseja validar ou rejeitar este voluntário?</p>
            <div className="popup-buttons">
              <button className="validarBtn" onClick={validarVoluntario}>Validar</button>
              <button className="rejeitarBtn" onClick={rejeitarVoluntario}>Rejeitar</button>
            </div>
          </div>
        </div>
      )}
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