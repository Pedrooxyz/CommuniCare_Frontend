import React, { useEffect, useState } from "react";
import { FaCubes, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./PendentesMaisInformacoes.css";

import person1 from '../../../../assets/person1.jpg';
import cares from '../../../../assets/Cares.png';
import { useParams } from "react-router-dom";
import { api } from '../../../../utils/axios.js';

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
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
          {/* Condição para mostrar o botão "Empréstimos Pendentes" apenas se o TipoUtilizadorId for admin */}
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

const DetalhesItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [fotoEmprestador, setFotoEmprestador] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItensEmprestimo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Item recebido:", response.data);
        setItem(response.data[0]); // <<=== aqui está a correção
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
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
        console.log("Foto do emprestador recebida:", response.data);

        const urlFoto = `http://localhost:5000/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(null);
      }
    };

    fetchItem();
    fetchFotoEmprestador();
  }, [id]);

  // Função VALIDAR
  const validarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/ItensEmprestimo/ValidarItem-(admin)/${itemId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert("Item validado com sucesso!");
      // Atualiza estado ou navega (aqui não tens setItems)
    } catch (error) {
      console.error("Erro ao validar item:", error);
      alert("Erro ao validar item.");
    }
  };

  const rejeitarItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/ItensEmprestimo/RejeitarItem-(admin)/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert("Item rejeitado com sucesso!");
      navigate("/PendentesEmprestimos");
    } catch (error) {
      console.error("Erro ao rejeitar item:", error);
      alert("Erro ao rejeitar item.");
    }
  };
  
  if (!item) {
    return <p>A carregar detalhes do item...</p>;
  }

  return (
    <div className="detalhesContainer">
      {/* LADO ESQUERDO */}
      <div className="colunaEsquerda">
        <div className="userTitle">
          <img
            className="imgUsers"
            src={fotoEmprestador}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '../../../../assets/icon.jpg';
            }}
            alt="User"
            width={70}
            height={70}
          />
          <h2 className="tituloItem">{item.nomeItem}</h2>
        </div>
        <img className="imgItemDetalhes" src={item.fotografiaItem} alt={item.nomeItem} />

        <div className="infoItem detalhes">
          <span> <FaCubes /> {item.disponivel}</span>
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
        </div>
        <div className="BotAcao">
          <button 
            className="botaoAceitar" 
            onClick={() => {
              validarItem(item.itemId);
              navigate("/PendentesEmprestimos");
            }}
          >
            Aceitar
          </button>
          <button 
            className="botaoRejeitar" 
            onClick={() => rejeitarItem(item.itemId)}
          >
            Rejeitar
          </button>
         
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>

        <div className="descricaoDetalhe">
          <p className="decriptionText">{item.descItem || "Sem descrição disponível."}</p>
        </div>
      </div>
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
