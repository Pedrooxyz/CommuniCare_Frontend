import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import "./MaisInformacoes.css";

import cares from '../../../../assets/Cares.png';
import { api } from '../../../../utils/axios.js';

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
        {userInfo ? userInfo.numCares : "..." }
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
          //e.target.src = '../../../../assets/icon.jpg';
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
          <button className="tab" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tab active" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Emprestimos
          </button>
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

const DetalhesItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState({
    nomeItem: "",
    descItem: "",
    comissaoCares: 0,
    fotografiaItem: "",
  });
  const [fotoEmprestador, setFotoEmprestador] = useState(null);
  const [fotosEmprestadores, setFotosEmprestadores] = useState({});

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

        console.log("Item carregado da API:", data);  

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

        const urlFoto = `http://localhost:5000/${response.data}`;
        setFotoEmprestador(urlFoto);
      } catch (error) {
        console.error('Erro ao buscar foto do emprestador:', error);
        setFotoEmprestador(null);
      }
    };

    fetchItem();
    fetchFotoEmprestador();

    const fetchItensEmprestimo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/ItensEmprestimo/Disponiveis', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

    fetchItensEmprestimo();

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
      alert("Houve um erro ao realizar a requisição. Tente novamente.");
    }
  };

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
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.comissaoCares}/h</span>
        </div>

        <button className="botaoAdquirir" onClick={() => requisitarItem(id)}>
          Adquirir
        </button>
      </div>

      <div className="colunaDireita">
        <h2 className="tituloItem">Detalhes do Item</h2>
        <div className="caixaDescricao">
          {item.descItem}
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
