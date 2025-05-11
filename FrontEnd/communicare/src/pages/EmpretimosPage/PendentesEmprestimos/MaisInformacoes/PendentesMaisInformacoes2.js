import React, { useEffect, useState } from "react";
import { FaCubes, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api } from '../../../../utils/axios.js';
import { getUserImageUrl } from '../../../../utils/url';

import iconFallback from '../../../../assets/icon.jpg';
import cares from '../../../../assets/Cares.png';
import person1 from '../../../../assets/person1.jpg';

import "./PendentesMaisInformacoes.css";

// Cabeçalho
const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        className="imgHeaderUser"
        onClick={() => navigate(`/profile`)}
        src={
          userInfo && userInfo.fotoUtil
            ? getUserImageUrl(userInfo.fotoUtil)
            : iconFallback
        }
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = iconFallback;
        }}
      />
    </header>
  );
};

// Função para tratar imagem do item com fallback
const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return iconFallback;
  }
};

// Barra de pesquisa e navegação entre abas
const Search = () => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

  useEffect(() => {
    const verificarTipoUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button className="tab" onClick={() => navigate("/meusEmprestimos")}>Meus Empréstimos</button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>Outros Empréstimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tab active" onClick={handleClickPendentes}>Empréstimos Pendentes</button>
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

// Componente com os detalhes do item
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data[0]);
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
      }
    };

    const fetchFotoEmprestador = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItensEmprestimo/${id}/foto-emprestador`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const urlFoto = `http://localhost:5000/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(iconFallback);
      }
    };

    fetchItem();
    fetchFotoEmprestador();
  }, [id]);

  const validarEmprestimo = async () => {
    try {
      const token = localStorage.getItem('token');

      // Chamar o endpoint de empréstimo correspondente para obter o empréstimo correspondente
      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${item.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;

      console.log("Emprestimo ativo encontrado:", emprestimoCorrespondente);

      // Agora, validar o empréstimo
      await api.post(`/Emprestimos/ValidarEmprestimo-(admin)/${emprestimoCorrespondente.emprestimoId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Empréstimo validado com sucesso!");
      navigate("/PendentesEmprestimos");
    } catch (error) {
      console.error("Erro ao validar empréstimo:", error);
      alert("Erro ao validar empréstimo.");
    }
  };

  const rejeitarEmprestimo = async () => {
    try {
      const token = localStorage.getItem('token');

      // Chamar o endpoint de empréstimo correspondente para obter o empréstimo correspondente
      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${item.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;
      
      console.log("Emprestimo ativo encontrado:", emprestimoCorrespondente);


      if (!emprestimoCorrespondente) {
        alert("Nenhum empréstimo correspondente encontrado.");
        return;
      }

      console.log("Emprestimo ativo encontrado para rejeição:", emprestimoCorrespondente);

      // Agora, rejeitar o empréstimo
      await api.post(`/Emprestimos/RejeitarEmprestimo-(admin)/${emprestimoCorrespondente.emprestimoId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Empréstimo rejeitado com sucesso!");
      navigate("/PendentesEmprestimos");
    } catch (error) {
      console.error("Erro ao rejeitar empréstimo:", error);
      alert("Erro ao rejeitar empréstimo.");
    }
  };

  if (!item) return <p>A carregar detalhes do item...</p>;

  return (
    <div className="detalhesContainer">
      {/* Lado Esquerdo */}
      <div className="colunaEsquerda">
        <div className="userTitle">
          <img
            className="imgUsers"
            src={fotoEmprestador || iconFallback}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = iconFallback;
            }}
            alt="User"
            width={70}
            height={70}
          />
          <h2 className="tituloItem">{item.nomeItem}</h2>
        </div>

        <img
          className="imgItemDetalhes"
          src={getImagemSrc(item.fotografiaItem)}
          alt={item.nomeItem}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = iconFallback;
          }}
        />

        <div className="infoItem detalhes">
          <span><FaCubes /> {item.disponivel}</span>
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
        </div>

        <div className="BotAcao">
          <button className="botaoAceitar" onClick={validarEmprestimo}>Aceitar</button>
          <button className="botaoRejeitar" onClick={rejeitarEmprestimo}>Rejeitar</button>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>
        <div className="descricaoDetalhe">
          <p className="decriptionText">{item.descItem || "Sem descrição disponível."}</p>
        </div>
      </div>
    </div>
  );
};


// Componente principal
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
