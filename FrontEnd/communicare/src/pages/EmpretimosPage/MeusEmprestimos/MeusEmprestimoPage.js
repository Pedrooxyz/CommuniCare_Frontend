import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaCubes, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusEmprestimosPage.css";

import person1 from "../../../assets/person1.jpg";
import cares from "../../../assets/Cares.png";
import cortaRelva from "../../../assets/cortaRelva.jpg";

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
        <button className="tab active" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
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

const ListaItems = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/ItensEmprestimo/MeusItens");
        console.log("Itens recebidos:", response.data);
        setItems(response.data);
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
      return cortaRelva; // fallback se não houver imagem
    }
  };

  return (
    <div className="cards">
      
    <div className="card adicionar-card" onClick={() => navigate("/pedirEmprestimo")} style={{ cursor: "pointer" }}>
      <div className="TitleOE">
        <h2>Adicionar Item</h2>
      </div>
      <div className="adicionarIcon" style={{ fontSize: "100px", textAlign: "center", marginTop: "190px" }}>+</div>
    </div>
      {items.map((item) => (
        <div className="card" key={item.itemId}>
          <div className="TitleOE">
            <h2>{item.nomeItem}</h2>
          </div>

          <img
            className="imgItemOE"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
          />

          <p>{item.descItem || "Sem descrição disponível."}</p>

          <div className="infoItemOE">
            <span>
              <FaCubes /> {item.disponivel ? "Disponível" : "Emprestado"}
            </span>
            <span>
              <img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h
            </span>
          </div>

          <div className="estadoItem">
            <div>
              <span className="estado">
                Estado:{" "}
                <span
                  className={`estado-circle ${
                    item.estado === "Disponível" ? "disponivel" : "emprestado"
                  }`}
                ></span>
              </span>
            </div>
            <div className="controlesAcao">
              <button className="EditDeleteButtons">
                <FaEdit />
              </button>
              <button className="EditDeleteButtons">
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
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaItems />
    </>
  );
}

export default MeusEmprestimos;
