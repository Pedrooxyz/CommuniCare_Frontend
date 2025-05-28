import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";
import "./OutrosEmprestimos.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

const Search = ({ searchTerm, setSearchTerm, userTipoUtilizadorId, handleClickPendentes }) => {
  const navigate = useNavigate();

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
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
          <FaSearch className="search-iconOE" />
        </div>
      </div>
    </div>
  );
};

 

const getImagemSrc = (foto) => {
  const baseUrl = "http://localhost:5182";
  if (foto && foto.trim() && foto !== "null" && foto !== "string") {
    if (foto.startsWith("data:image") || foto.startsWith("http")) {
      return foto;
    }
    return `${baseUrl}${foto}`;
  }
  return iconFallback;
};

 const getImagemSrc2 = (fotografiaItem) => {
    if (fotografiaItem && fotografiaItem.trim() !== "") {
      return `data:image/jpeg;base64,${fotografiaItem}`;
    } else {
      return iconFallback;
    }
  };

const ListaItems = ({ searchTerm }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/ItensEmprestimo/Disponiveis");
        const itemsData = response.data;
        const itemsWithEmprestador = await Promise.all(
          itemsData.map(async (item) => {
            try {
              const emprestadorResponse = await api.get(`/ItensEmprestimo/${item.itemId}/dados-emprestador`);
              console.log(`Dados do emprestador para item ${item.itemId}:`, emprestadorResponse.data);
              return {
                ...item,
                emprestador: {
                  id: emprestadorResponse.data.idEmprestador || null,
                  nome: emprestadorResponse.data.nomeEmprestador || "Desconhecido",
                  foto: getImagemSrc(emprestadorResponse.data.fotoUtil),
                },
              };
            } catch (error) {
              console.error(`Erro ao buscar dados do emprestador para item ${item.itemId}:`, error);
              return {
                ...item,
                emprestador: {
                  id: null,
                  nome: "Desconhecido",
                  foto: iconFallback,
                },
              };
            }
          })
        );

        setItems(itemsWithEmprestador);
      } catch (error) {
        console.error("Erro ao buscar itens disponíveis:", error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.nomeItem.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="cardsOE">
      {filteredItems.map((item) => (
        <div className="cardOE" key={item.itemId}>
          <div className="userTitleOE1">
            <img
              className="imgUsersOE"
              src={item.emprestador.foto}
              onError={(e) => {
                console.log(`Erro ao carregar imagem do emprestador para item ${item.itemId}`);
                e.target.onerror = null;
                e.target.src = iconFallback;
              }}
              alt="Foto do emprestador"
              width={70}
              height={70}
              style={{ cursor: "pointer" }}
              onClick={() => item.emprestador.id && navigate(`/PerfilOutroUtilizador/${item.emprestador.id}`)}
            />
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemOE1"
            src={getImagemSrc2(item.fotografiaItem)}
            alt={item.nomeItem}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
          />
          <div className="descOE">
            <h4 className="descoE">{item.descItem || "Sem descrição disponível."}</h4>
          </div>
          <div className="infoItemOE1">
            <span>
              <img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h
            </span>
            <button
              className="BotaoInformacaoOutros"
              onClick={() => navigate(`/maisInfo/${item.itemId}`)}
            >
              Mais Informações
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

function OutrosEmprestimos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarTipoUtilizador = async () => {
      try {
        const response = await api.get("/Utilizadores/VerificarAdmin");
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