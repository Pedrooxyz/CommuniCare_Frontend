import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./PendentesEmprestimos.css";
import iconFallback from '../../../assets/icon.jpg';
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";
import cares from '../../../assets/Cares.png';
import ToastBar from "../../../components/ToastBar/ToastBar.js";

const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);
  const [toast, setToast] = useState(null);

  const verificarTipoUtilizador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const response = await api.get("/Utilizadores/VerificarAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserTipoUtilizadorId(response.data);
    } catch (error) {
      setUserTipoUtilizadorId(false);
      setToast({
        message: error.message || "Erro ao verificar o tipo de utilizador.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos");
    } else {
      setToast({
        message: "Apenas administradores podem aceder a esta página!",
        type: "error",
      });
    }
  };

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabsOE">
        <div className="chooseOE">
          <button className="tabOE" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tabOE" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tabOE active" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapperOE">
          <input type="text" placeholder="Pesquisar..." className="searchOE" />
          <FaSearch className="search-iconOE" />
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

const HeaderSecundario = ({ onValidarRequisicao, onValidarAquisicao, onValidarDevolucao, secaoAtiva }) => {
  return (
    <div className="header-secundario">
      <button
        className={`botao-header-secundario ${secaoAtiva === 'validarRequisicao' ? 'active' : ''}`}
        onClick={onValidarRequisicao}
      >
        Validar Item
      </button>
      <button
        className={`botao-header-secundario ${secaoAtiva === 'validarAquisicao' ? 'active' : ''}`}
        onClick={onValidarAquisicao}
      >
        Validar Aquisição
      </button>
      <button
        className={`botao-header-secundario ${secaoAtiva === 'validarDevolucao' ? 'active' : ''}`}
        onClick={onValidarDevolucao}
      >
        Validar Devolução Item
      </button>
    </div>
  );
};

const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null" && fotoItem !== "string") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return iconFallback;
  }
};

const ListaItems = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get('/ItensEmprestimo/Admin/ItensPendentes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);

        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = `http://localhost:5182/${fotoResponse.data}`;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            setToast({
              message: `Erro ao buscar foto do emprestador para item ${item.itemId}.`,
              type: "error",
            });
          }
        });
      } catch (error) {
        setToast({
          message: error.message || "Erro ao buscar os itens pendentes.",
          type: "error",
        });
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cardsPE">
      {items.map((item) => (
        <div className="cardPE" key={item.itemId}>
          <div className="userTitlePE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] || iconFallback}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemPE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <div className="descPE">
            <p className="descpE">{item.descItem || "Sem descrição disponível."}</p>
          </div>
          <div className="infoItemPE">
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfoPE">
            <button onClick={() => navigate(`/pendentesMaisInformacoes/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
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

const ListaItemsAquisicao = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get('/ItensEmprestimo/Admin/ItensPendentes/Aquisicao', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);

        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = `http://localhost:5182/${fotoResponse.data}`;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            setToast({
              message: `Erro ao buscar foto do emprestador para item ${item.itemId}.`,
              type: "error",
            });
          }
        });
      } catch (error) {
        setToast({
          message: error.message || "Erro ao buscar os itens pendentes de aquisição.",
          type: "error",
        });
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cardsPE">
      {items.map((item) => (
        <div className="cardPE" key={item.itemId}>
          <div className="userTitlePE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] || iconFallback}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemPE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <div className="descPE">
            <p className="descpE">{item.descItem || "Sem descrição disponível."}</p>
          </div>
          <div className="infoItemPE">
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pendentesMaisInformacoes2/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
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

const ListaItemsDevolucao = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get('/ItensEmprestimo/Admin/ItensPendentes/Devolucao', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);

        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = `http://localhost:5182/${fotoResponse.data}`;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            setToast({
              message: `Erro ao buscar foto do emprestador para item ${item.itemId}.`,
              type: "error",
            });
          }
        });
      } catch (error) {
        setToast({
          message: error.message || "Erro ao buscar os itens pendentes de devolução.",
          type: "error",
        });
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cardsPE">
      {items.map((item) => (
        <div className="cardPE" key={item.itemId}>
          <div className="userTitlePE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] || iconFallback}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemPE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <div className="descPE">
            <p className="descpE">{item.descItem || "Sem descrição disponível."}</p>
          </div>
          <div className="infoItemPE">
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pendentesMaisInformacoes3/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
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

function PendentesEmprestimos() {
  const [secaoAtiva, setSecaoAtiva] = useState(null);

  useEffect(() => {
    setSecaoAtiva('validarRequisicao');
  }, []);

  return (
    <>
      <HeaderProfileCares />
      <Search />
      <HeaderSecundario
        onValidarRequisicao={() => setSecaoAtiva('validarRequisicao')}
        onValidarAquisicao={() => setSecaoAtiva('validarAquisicao')}
        onValidarDevolucao={() => setSecaoAtiva('validarDevolucao')}
        secaoAtiva={secaoAtiva}
      />
      {secaoAtiva === 'validarRequisicao' && <ListaItems />}
      {secaoAtiva === 'validarAquisicao' && <ListaItemsAquisicao />}
      {secaoAtiva === 'validarDevolucao' && <ListaItemsDevolucao />}
    </>
  );
}

export default PendentesEmprestimos;