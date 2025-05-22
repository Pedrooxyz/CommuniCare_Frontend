import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import "./PendentesEmprestimos.css";
import iconFallback from '../../../assets/icon.jpg';

import HeaderProfileCares from "../../../utils/headerProfile.js"; 

import cares from '../../../assets/Cares.png';




const Search = () => {
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
      navigate("/PendentesEmprestimos"); 
    } else {
      alert("Apenas administradores podem aceder a esta página!");
    }
  };

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tab active" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}          
        </div>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar..." className="search" />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const HeaderSecundario = ({ onValidarRequisicao, onValidarAquisicao, onValidarDevolucao }) => {
  return (
    <div className="header-secundario">
      <button className="botao-header-secundario" onClick={onValidarRequisicao}>
        Validar Requisição
      </button>
      <button className="botao-header-secundario" onClick={onValidarAquisicao}>
        Validar Aquisição
      </button>
      <button className="botao-header-secundario" onClick={onValidarDevolucao}>
        Validar Devolução
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
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
            const urlFoto = fotoResponse.data;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            console.error(`Erro ao buscar foto do emprestador para item ${item.itemId}:`, error);
          }
        });

      } catch (error) {
        console.error('Erro ao buscar os itens pendentes:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cards">
      {items.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] ? getImagemSrc(fotosEmprestadores[item.itemId]) : iconFallback}
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
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{item.descItem || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> {item.disponivel}</span>
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pendentesMaisInformacoes/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListaItemsAquisicao = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/ItensEmprestimo/Admin/ItensPendentes/Aquisicao', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Itens pendentes recebidos:", response.data);
        setItems(response.data);
  
        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = fotoResponse.data;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            console.error(`Erro ao buscar foto do emprestador para item ${item.itemId}:`, error);
          }
        });
      } catch (error) {
        console.error('Erro ao buscar os itens pendentes:', error);
      }
    };

    console.log(localStorage.getItem('token'));
    fetchItems();
  }, []);

  return (
    <div className="cards">
      {items.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] ? getImagemSrc(fotosEmprestadores[item.itemId]) : iconFallback}
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
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{item.descItem || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> {item.disponivel}</span>
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pendentesMaisInformacoes2/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ListaItemsDevolucao = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/ItensEmprestimo/Admin/ItensPendentes/Devolucao', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Itens pendentes recebidos:", response.data);
        setItems(response.data);
  
        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = fotoResponse.data;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            console.error(`Erro ao buscar foto do emprestador para item ${item.itemId}:`, error);
          }
        });
      } catch (error) {
        console.error('Erro ao buscar os itens pendentes:', error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="cards">
      {items.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="userTitleOE">
            <img
              className="imgUsers"
              src={fotosEmprestadores[item.itemId] ? getImagemSrc(fotosEmprestadores[item.itemId]) : iconFallback}
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
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <p>{item.descItem || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><FaCubes /> {item.disponivel}</span>
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/pendentesMaisInformacoes3/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
    </div>
  );
};

function PendentesEmprestimos() {
  const [secaoAtiva, setSecaoAtiva] = useState(null); 

  return (
    <>
      <HeaderProfileCares />
      <Search />
      <HeaderSecundario 
        onValidarRequisicao={() => setSecaoAtiva('validarRequisicao')} 
        onValidarAquisicao={() => setSecaoAtiva('validarAquisicao')}
        onValidarDevolucao={() => setSecaoAtiva('validarDevolucao')}
      />

      {secaoAtiva === 'validarRequisicao' && <ListaItems />}
      {secaoAtiva === 'validarAquisicao' && <ListaItemsAquisicao />}
      {secaoAtiva === 'validarDevolucao' && <ListaItemsDevolucao />}
    </>
  );
}

export default PendentesEmprestimos;