import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import cares from '../../../assets/Cares.png';
import iconFallback from '../../../assets/icon.jpg';
import "./OutrosEmprestimos.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";


const Search = ({ searchTerm, setSearchTerm, userTipoUtilizadorId, handleClickPendentes }) => {
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="mainNameMI1">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabsOE">
        <div className="chooseOE">
          <button className="tabOE" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tabOE active" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Empréstimos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tabOE" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapperOE">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="searchOE"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <FaSearch className="search-iconOE" />
        </div>
      </div>
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

const ListaItems = ({ searchTerm }) => {
  const [items, setItems] = useState([]);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});
  const navigate = useNavigate();

  const requisitarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/ItensEmprestimo/AdquirirItem/${itemId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
            console.error(`Erro ao buscar foto do emprestador para item ${item.itemId}:`, error);
          }
        });

      } catch (error) {
        console.error('Erro ao buscar os itens disponíveis:', error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.nomeItem.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="cardsOE">
      {filteredItems.map((item) => (
        <div className="cardOE" key={item.itemId}>
          <div className="userTitleOE1">
            <img
              className="imgUsersOE"
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
            className="imgItemOE1"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
          />
          <div className="descOE">
            <h className="descOE">
              {item.descItem || "Sem descrição disponível."}
            </h>
          </div>
          <div className="infoItemOE1">
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
            <button className="BotaoInformacaoOutros" onClick={() => navigate(`/maisInfo/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
    </div>
  );
};

function OutrosEmprestimos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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
    <>
      <HeaderProfileCares />
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        userTipoUtilizadorId={userTipoUtilizadorId}
        handleClickPendentes={handleClickPendentes}
      />
      <ListaItems searchTerm={searchTerm} />
    </>
  );
}

export default OutrosEmprestimos;
