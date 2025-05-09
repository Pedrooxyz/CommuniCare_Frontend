import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import "./OutrosEmprestimos.css";

// Importação das imagens
import cares from '../../../assets/Cares.png';

const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User info recebida:", response.data);
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
        {userInfo ? userInfo.numCares : "..." }
      </p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img
        className="imgHeaderVol"
        src={userInfo ? `http://localhost:5000/${userInfo.fotoUtil}` : '../../../../assets/icon.jpg'}
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '../../../../assets/icon.jpg';
        }}
      />
    </header>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearch = async (term) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/ItensEmprestimo/PesquisarItemPorNome", 
        {
          nomeItem: term,
          descItem: "string",
          comissaoCares: 0,
          fotografiaItem: "string"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setSearchResults(response.data); 
    } catch (error) {
      console.error("Erro ao buscar itens", error);
      setSearchResults([]); 
    }
  };

  useEffect(() => {
    verificarTipoUtilizador(); 
  }, []);

  const handleInputChange = (e) => {
    const term = e.target.value.toLowerCase(); 
    setSearchTerm(term);
    if (term.trim() !== "") {
      handleSearch(term); 
    } else {
      setSearchResults([]); 
    }
  };

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
          <button className="tab active" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Empréstimos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item, index) => (
            <div key={index} className="search-item">
              <h3>{item.NomeItem}</h3>
              <p>{item.DescItem}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ListaItems = () => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const navigate = useNavigate();

  // Função para requisitar o item
  const requisitarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/ItensEmprestimo/AdquirirItem/${itemId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200) {
        alert("Pedido de empréstimo efetuado. Aguarde validação do administrador.");
      } else {
        alert(`Erro: ${response.data}`);
      }
    } catch (error) {
      console.error("Erro ao requisitar item:", error);
      alert("Houve um erro ao realizar a requisição. Tente novamente.");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/ItensEmprestimo/Disponiveis', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Itens recebidos:", response.data);
        setItems(response.data);

        // Buscar as fotos dos emprestadores
        response.data.forEach(async (item) => {
          try {
            const fotoResponse = await api.get(`/ItensEmprestimo/${item.itemId}/foto-emprestador`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const urlFoto = `http://localhost:5000/${fotoResponse.data}`;
            setFotosEmprestadores(prev => ({
              ...prev,
              [item.itemId]: urlFoto
            }));
          } catch (error) {
            console.error(`Erro ao buscar foto do emprestador para item ${item.itemId}:`, error);
          }
        });
      } catch (error) {
        console.error('Erro ao buscar os itens disponíveis:', error);
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
              src={fotosEmprestadores[item.itemId] || '../../../../assets/icon.jpg'}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img className="imgItemOE" src={item.fotografiaItem} alt={item.nomeItem} /> 
          <p>{item.descItem || "Sem descrição disponível."}</p>
          <div className="infoItemOE">
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/maisInfo/${item.itemId}`)} className="mais-info-btn">
              Mais Informações
            </button>
            <button onClick={() => requisitarItem(item.itemId)} className="requisitar-btn">
              Requisitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

function OutrosEmprestimos() {
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaItems />
    </>
  );
}

export default OutrosEmprestimos;
