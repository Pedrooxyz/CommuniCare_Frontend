import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusEmprestimosPage.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";


import cares from "../../../assets/Cares.png";
import cortaRelva from "../../../assets/cortaRelva.jpg";
import iconFallback from '../../../assets/icon.jpg';


const Search = ({ searchTerm, setSearchTerm }) => {
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
          <button className="tab active" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
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
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

const ListaItems = ({ searchTerm }) => {
  const [items, setItems] = useState([]);
  const [itensEmUso, setItensEmUso] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/ItensEmprestimo/MeusItens");
        setItems(response.data);

        const responseEmUso = await api.get("/ItensEmprestimo/MeusItensEmUso");
        setItensEmUso(responseEmUso.data);
      } catch (error) {
        console.error("Erro ao buscar itens:", error);
      }
    };

    fetchItems();
  }, []);

  const getImagemSrc = (fotografiaItem) => {
    if (fotografiaItem && fotografiaItem.trim() !== "") {
      return `data:image/jpeg;base64,${fotografiaItem}`;
    } else {
      return cortaRelva;
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/editarItem/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Tem certeza que deseja indisponibilizar permanentemente este item?")) {
      try {
        const response = await api.delete(`/ItensEmprestimo/IndisponibilizarPermanenteItem/${itemId}`);
        if (response.status === 204) {
          setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
        } else {
          alert("Erro ao indisponibilizar o item. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao indisponibilizar o item:", error);
        alert("Erro ao indisponibilizar o item. Tente novamente.");
      }
    }
  };

  const isItemEmUso = (item) => {
    return itensEmUso.some((itemUso) => itemUso.nomeItem === item.nomeItem);
  };

  const concluirEmprestimo = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;

      if (emprestimoCorrespondente) {
        const response = await api.post(`/Emprestimos/DevolucaoItem/${emprestimoCorrespondente.emprestimoId}`);
        if (response.status === 200) {
          alert("Devolução concluída com sucesso!");
          setItensEmUso((prevItens) => prevItens.filter((item) => item.itemId !== itemId));
        } else {
          alert("Erro ao concluir a devolução.");
        }
      } else {
        alert("Nenhum empréstimo encontrado para este item.");
      }
    } catch (error) {
      console.error("Erro ao concluir devolução:", error);
      alert("Erro ao concluir devolução.");
    }
  };

  const filteredItems = items.filter(item =>
    item.nomeItem.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="cards">
      <div className="card adicionar-card" onClick={() => navigate("/pedirEmprestimo")}>
        <div className="TitleOE">
          <h2>Adicionar Item</h2>
        </div>
        <div className="adicionarIcon">+</div>
      </div>

      {filteredItems.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="TitleOE">
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
          />
          <div className="descME">
            <h>{item.descItem || "Sem descrição disponível."}</h>
          </div>
          <div className="infoItemME">
            <span>
              <img src={cares} width={35} height={35} alt="Cares" /> {item.comissaoCares}/h
            </span>
          </div>
          <div className="estadoEAcao">
            <span>
              Estado:
              <span
                className={`estado-circle ${
                  isItemEmUso(item)
                    ? "em-uso"
                    : item.disponivel === 1
                    ? "disponivel"
                    : item.disponivel === 0
                    ? "indisponivel"
                    : item.disponivel === 2
                    ? "permanentemente-indisponivel"
                    : ""
                }`}
              >
                {isItemEmUso(item)
                  ? "Em Uso"
                  : item.disponivel === 1
                  ? "Disponível"
                  : item.disponivel === 0
                  ? "Pendente"
                  : item.disponivel === 2
                  ? "Ind. Permanente"
                  : ""}
              </span>
            </span>
            {isItemEmUso(item) && (
              <button onClick={() => concluirEmprestimo(item.itemId)}>
                Concluir
              </button>
            )}
            <div className="controlesAcao">
              <button className="EditDeleteButtonsME" onClick={() => handleEdit(item.itemId)}>
                <FaEdit />
              </button>
              <button className="EditDeleteButtonsME" onClick={() => handleDelete(item.itemId)}>
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


function MeusEmprestimos() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HeaderProfileCares />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ListaItems searchTerm={searchTerm} />
    </>
  );
}

export default MeusEmprestimos;
