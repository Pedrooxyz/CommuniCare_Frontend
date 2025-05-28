import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';
import PopUp from "../../../../components/PopUpPage/PopUp.js";
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";

import "./MaisInformacoes.css";

import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';



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
      <div className="tabsMIOE">
        <div className="chooseMIOE">
          <button className="tabMIOE" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tabMIOE active" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Empréstimos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tabMIOE" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapperMIOE">
          <input type="text" placeholder="Pesquisar..." className="search1" />
          <FaSearch className="search-iconMIOE" />
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
    <div className="detalhesContainerMIOE">
      <div className="colunaEsquerdaMIOE">
        <div className="userTitleMIOE">
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

      <div className="colunaDireitaMIOE">
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
        <PopUp
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default MaisInformacoes;
