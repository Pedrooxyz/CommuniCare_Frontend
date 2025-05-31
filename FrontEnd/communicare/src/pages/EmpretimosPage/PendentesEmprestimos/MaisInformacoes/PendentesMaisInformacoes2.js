import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/axios.js";
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";
import iconFallback from '../../../../assets/icon.jpg';
import cares from '../../../../assets/Cares.png';
import "./PendentesMaisInformacoes.css";
import ToastBar from "../../../../components/ToastBar/ToastBar.js";

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
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const verificarTipoUtilizador = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserTipoUtilizadorId(response.data);
      } catch (error) {
        setUserTipoUtilizadorId(false);
        setToast({
          message: error.message || "Erro ao verificar o tipo de utilizador.",
          type: "error",
        });
      }
    };
    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos");
    } else {
      setToast({
        message: "Apenas administradores podem aceder a esta página!",
        type: "error",
      });
    }
  };

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabsOE">
        <div className="chooseOE">
          <button className="tabOE" onClick={() => navigate("/meusEmprestimos")}>Meus Empréstimos</button>
          <button className="tabOE" onClick={() => navigate("/outrosEmprestimos")}>Outros Empréstimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tabOE active" onClick={handleClickPendentes}>Empréstimos Pendentes</button>
          )}
        </div>
        <div className="search-wrapperOE">
          <input type="text" placeholder="Pesquisar..." className="searchOE" />
          <FaSearch className="search-iconOE" />
        </div>
      </div>
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const DetalhesItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [fotoEmprestador, setFotoEmprestador] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get(`/ItensEmprestimo/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItem(response.data[0]);
      } catch (error) {
        setToast({
          message: error.message || "Erro ao buscar detalhes do item.",
          type: "error",
        });
      }
    };

    const fetchFotoEmprestador = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get(`/ItensEmprestimo/${id}/foto-emprestador`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const urlFoto = `http://localhost:5182/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        setFotoEmprestador(iconFallback);
        setToast({
          message: error.message || "Erro ao buscar foto do emprestador.",
          type: "error",
        });
      }
    };

    fetchItem();
    fetchFotoEmprestador();
  }, [id]);

  const validarEmprestimo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${item.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;

      if (!emprestimoCorrespondente?.emprestimoId) {
        setToast({
          message: "Nenhum empréstimo correspondente encontrado.",
          type: "error",
        });
        return;
      }

      await api.post(`/Emprestimos/ValidarEmprestimo-(admin)/${emprestimoCorrespondente.emprestimoId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToast({
        message: "Empréstimo validado com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/PendentesEmprestimos");
      }, 3000);
    } catch (error) {
      setToast({
        message: error.response?.data || "Erro ao validar empréstimo.",
        type: "error",
      });
    }
  };

  const rejeitarEmprestimo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${item.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;

      if (!emprestimoCorrespondente?.emprestimoId) {
        setToast({
          message: "Nenhum empréstimo correspondente encontrado.",
          type: "error",
        });
        return;
      }

      await api.post(`/Emprestimos/RejeitarEmprestimo-(admin)/${emprestimoCorrespondente.emprestimoId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToast({
        message: "Empréstimo rejeitado com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/PendentesEmprestimos");
      }, 3000);
    } catch (error) {
      setToast({
        message: error.response?.data || "Erro ao rejeitar empréstimo.",
        type: "error",
      });
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
          <button className="botaoAceitar" onClick={validarEmprestimo}>Aceitar</button>
          <button className="botaoRejeitarA" onClick={rejeitarEmprestimo}>Rejeitar</button>
        </div>
      </div>

      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>
        <div className="descricaoDetalhe">
          <p className="decriptionTextA">{item.descItem || "Sem descrição disponível."}</p>
        </div>
      </div>
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
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