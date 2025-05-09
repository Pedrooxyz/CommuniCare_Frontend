import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from '../../../utils/axios.js';
import "./OutrosEmprestimos.css";


// Importação das imagens
import person1 from '../../../assets/person1.jpg';
import cares from '../../../assets/Cares.png';
import person7 from '../../../assets/person7.png';
import person8 from '../../../assets/person8.png';
import person9 from '../../../assets/person9.png';
import martelo from '../../../assets/martelo.jpg';
import cortaRelva from '../../../assets/cortaRelva.jpg';
import compressor from '../../../assets/compressor.jpg';

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
        {userInfo ? userInfo.numCares : "..."}
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
          e.target.src = '../../../../assets/icon.jpg'; // Fallback caso a imagem não exista
        }}
      />
    </header>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo de pesquisa
  const [searchResults, setSearchResults] = useState([]); // Estado para armazenar os resultados da pesquisa
  
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
      setUserTipoUtilizadorId(false); // Caso ocorra erro, tratamos como não admin
    }
  };

  const handleSearch = async (term) => {
    try {
      const token = localStorage.getItem("token");
  
      // Enviar o termo dentro do objeto esperado pelo endpoint
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
      
      setSearchResults(response.data); // Armazenar os resultados da pesquisa
    } catch (error) {
      console.error("Erro ao buscar itens", error);
      setSearchResults([]); // Se ocorrer erro, limpar resultados
    }
  };

  // Carregar o tipo de utilizador ao montar o componente
  useEffect(() => {
    verificarTipoUtilizador(); // Verifica o tipo de utilizador assim que o componente for montado
  }, []);

  // Função chamada sempre que o usuário digitar algo
  const handleInputChange = (e) => {
    const term = e.target.value.toLowerCase(); // Faz a pesquisa ser case-insensitive
    setSearchTerm(term); // Atualiza o estado com o termo de pesquisa
    if (term.trim() !== "") {
      handleSearch(term); // Chama a função de pesquisa
    } else {
      setSearchResults([]); // Limpa resultados se a pesquisa estiver vazia
    }
  };

  // Função para navegar para a página de "Empréstimos Pendentes"
  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos"); // Navega para a página desejada
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
            onChange={handleInputChange} // Chama a função sempre que o input mudar
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      {/* Exibição dos resultados da pesquisa */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item, index) => (
            <div key={index} className="search-item">
              <h3>{item.NomeItem}</h3>
              <p>{item.DescItem}</p>
              {/* Adicionar mais informações conforme necessário */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null" && fotoItem !== "string") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return "../../../../assets/icon.jpg";  // Fallback em caso de erro
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
        const response = await api.get('/ItensEmprestimo/Disponiveis', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Itens recebidos:", response.data);
        setItems(response.data);

        // Buscar fotos dos emprestadores para cada item
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
              src={fotosEmprestadores[item.itemId] || '../../../../assets/icon.jpg'}  // Fallback aqui também
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '../../../../assets/icon.jpg';  // Fallback caso não encontre a foto
              }}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img 
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}  // Usando a função getImagemSrc para a foto do item
            alt={item.nomeItem} 
          /> 
          <p>
            {item.descItem || "Sem descrição disponível."}
          </p>          
          <div className="infoItemOE">
            <span><FaCubes /> {item.disponivel}</span>
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span>
          </div>
          <div className="moreInfo">
            <button onClick={() => navigate(`/maisInfo/${item.itemId}`)}>Mais Informações</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Função descomentada para renderizar a página
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