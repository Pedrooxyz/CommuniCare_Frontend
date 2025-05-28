import React, { useEffect, useState } from "react";
import { FaCubes, FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api } from '../../../../utils/axios.js';
import { getUserImageUrl } from '../../../../utils/url';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";

import iconFallback from '../../../../assets/icon.jpg';
import cares from '../../../../assets/Cares.png';


import "./PendentesMaisInformacoes.css";


const getImagemSrc = (fotoItem) => {
  if (fotoItem && fotoItem.trim() !== "" && fotoItem !== "null") {
    return `data:image/jpeg;base64,${fotoItem}`;
  } else {
    return iconFallback;
  }
};


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
        const urlFoto = `http://localhost:5182/${response.data}`;
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
    console.log("Início da validação do empréstimo...");

    const token = localStorage.getItem('token');
    console.log("Token obtido:", token);

    if (!token) {
      console.error("Token não encontrado no localStorage.");
      alert("Sessão expirada. Por favor, faça login novamente.");
      return;
    }

    console.log("A buscar empréstimo correspondente para o item ID:", item?.itemId);

    const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItemParaDevolucao/${item.itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Resposta do endpoint EmprestimoCorrespondenteItem:", emprestimoResponse);

    const emprestimoCorrespondente = emprestimoResponse.data;
    console.log("Empréstimo ativo encontrado:", emprestimoCorrespondente);

    if (!emprestimoCorrespondente?.emprestimoId) {
      console.error("Nenhum empréstimo correspondente encontrado ou emprestimoId inválido.");
      alert("Erro: Empréstimo não encontrado.");
      return;
    }

    console.log("A validar devolução do empréstimo ID:", emprestimoCorrespondente.emprestimoId);

    await api.post(`/Emprestimos/ValidarDevolucao-(admin)/${emprestimoCorrespondente.emprestimoId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Validação da devolução feita com sucesso.");
    alert("Empréstimo validado com sucesso!");
    navigate("/PendentesEmprestimos");
  } catch (error) {
    console.error("Erro ao validar empréstimo:", error);
    if (error.response) {
      console.error("Resposta do servidor:", error.response);
      console.error("Dados do erro:", error.response.data);
      console.error("Status do erro:", error.response.status);
      console.error("Headers do erro:", error.response.headers);
    }
    alert("Erro ao validar empréstimo.");
  }
};

  if (!item) return <p>A carregar detalhes do item...</p>;

  return (
    <div className="detalhesContainer">
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
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
        </div>

        <div className="BotAcao">
          <button className="botaoAceitar" onClick={validarEmprestimo}>Validar</button>
        </div>
      </div>

      
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>
        <div className="descricaoDetalhe">
          <p className="decriptionTextA">{item.descItem || "Sem descrição disponível."}</p>
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