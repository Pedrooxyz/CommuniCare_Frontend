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
  return (
    <header>
      <p>100</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

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
      setUserTipoUtilizadorId(false); // Caso ocorra erro, tratamos como não admin
    }
  };

  // Carregar o tipo de utilizador ao montar o componente
  useEffect(() => {
    verificarTipoUtilizador(); // Verifica o tipo de utilizador assim que o componente for montado
  }, []);

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
          <button className="tab active" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
          {/* Condição para mostrar o botão "Empréstimos Pendentes" apenas se o TipoUtilizadorId for admin */}
          {userTipoUtilizadorId === true && (
            <button className="tab" onClick={handleClickPendentes}>
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

/*export const items = [
  {
    id: 1,
    user: person7,
    title: "Corta Relvas",
    image: cortaRelva,
    description: "Precisa aparar o jardim? Emprestamos um corta-relvas! Interessado? Fale connosco!",
    units: 1,
    caresHour: "35/h",
    details: `Corta-relvas Elétrico GreenTech 3000
    * Elétrico com fio
    * Potência: 1800W
    * Largura de corte: 40 cm
    * Altura de corte: Ajustável (25-75 mm)
    * Capacidade do saco de recolha: 50L
    * Peso: 12 kg`
  },
  {
    id: 2,
    user: person8,
    title: "Compressor",
    image: compressor,
    description: "Precisa encher pneus ou usar ferramentas pneumáticas? Entre em contato!",
    units: 2,
    caresHour: "40/h",
    details: `Martelo Clássico GreenTech Standard 500
    * Manual, cabo ergonómico em madeira
    * Peso da cabeça: 500 g
    * Comprimento do cabo: 30 cm
    * Material da cabeça: Aço forjado
    * Aplicação: Cravar pregos, pequenos trabalhos de demolição
    * Peso total: 0,6 kg`
  },
  {
    id: 3,
    user: person9,
    title: "Martelo",
    image: martelo,
    description: "Precisa de um martelo? Temos disponíveis, comunique connosco!!",
    units: 3,
    caresHour: "20/h",
    details: `Martelo Clássico GreenTech Standard 500
    * Manual, cabo ergonómico em madeira
    * Peso da cabeça: 500 g
    * Comprimento do cabo: 30 cm
    * Material da cabeça: Aço forjado
    * Aplicação: Cravar pregos, pequenos trabalhos de demolição
    * Peso total: 0,6 kg`
  }
];*/

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

        // Agora, buscar fotos dos emprestadores para cada item
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
              src={fotosEmprestadores}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '../../../../assets/icon.jpg';
              }}
              alt="User"
              width={70}
              height={70}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img className="imgItemOE" src={item.fotografiaItem} alt={item.nomeItem} /> 
          <p>
            {item.descItem || "Sem descrição disponível."}
          </p>          
          <div className="infoItemOE">
            <span><FaCubes /> {item.disponivel}</span> {/* Alterado para 'disponivel' */}
            <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}(h)</span> {/* Alterado para 'comissaoCares' */}
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