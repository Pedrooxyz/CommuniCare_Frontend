import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';

import "./MaisInformacoes.css";

import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';

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
      <div className="mainNameMI1">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs1">
        <div className="choose1">
          <button className="tab1" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tab1 active" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Empréstimos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab1" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapper1">
          <input type="text" placeholder="Pesquisar..." className="search1" />
          <FaSearch className="search-icon1" />
        </div>
      </div>
    </div>
  );
};


const DetalhesItem = ({ setPopupMessage, setShowPopup }) => {
  const { id } = useParams();
  const [item, setItem] = useState({
    nomeItem: "",
    descItem: "",
    comissaoCares: 0,
    fotografiaItem: "",
  });
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

        const data = response.data[0];
        setItem({
          nomeItem: data.nomeItem ?? "",
          descItem: data.descItem ?? "",
          comissaoCares: data.comissaoCares ?? 0,
          fotografiaItem: data.fotografiaItem ?? "",
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
        alert('Erro ao carregar os detalhes do item.');
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
        const urlFoto = `http://localhost:5182/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(null);
      }
    };

    fetchItem();
    fetchFotoEmprestador();
  }, [id]);

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

      const mensagemErro = error?.response?.data;

      if (mensagemErro === "Saldo de Cares insuficiente para adquirir este item.") {
        setPopupMessage("Não tens Cares suficientes para adquirir este item. Participa como voluntário para ganhar mais Cares!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 15000);
      } else {
        alert("Houve um erro ao realizar a requisição. Tente novamente.");
      }
    }
  };

  return (
    <div className="detalhesContainer">
      <div className="colunaEsquerdaMI">
        <div className="userTitleMD">
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
          className="imgItemDetalhesMI"
          src={getImagemSrc(item.fotografiaItem)}
          alt={item.nomeItem}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = iconFallback;
          }}
        />

        <div className="infoItem detalhes">
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>

          <button className="botaoAdquirir" onClick={() => requisitarItem(id)}>
            Adquirir
          </button>
        </div>
      </div>

      <div className="colunaDireitaMI">
        <h2 className="tituloItem">Detalhes</h2>
        <div className="caixaDescricao">
          {item.descItem}
        </div>
      </div>
    </div>
  );
};

function MaisInformacoes() {
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <HeaderProfileCares />
      <Search />
      <DetalhesItem
        setPopupMessage={setPopupMessage}
        setShowPopup={setShowPopup}
      />
      {showPopup && (
        <>
          <div className="popupFundo" onClick={() => setShowPopup(false)}></div>
          <div className="popupAviso">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </>
      )}
    </>
  );
}

export default MaisInformacoes;
