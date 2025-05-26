import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getUserImageUrl } from '../../../../utils/url';
import iconFallback from '../../../../assets/icon.jpg';
import HeaderProfileCares from "../../../../components/HeaderProfile/headerProfile.js";

import "./MaisInfoPedidos.css";

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
      navigate("/pendentesPedidos");
    } else {
      alert("Apenas administradores podem aceder a esta página!");
    }
  };

  return (
    <div>
      <div className="mainNameMI1">
        <h1>Pedidos Ajuda</h1>
      </div>
      <div className="tabs1">
        <div className="choose1">
          <button className="tab1" onClick={() => navigate("/meusPedidos")}>
            Meus Pedidos
          </button>
          <button className="tab1 active" onClick={() => navigate("/outrosPedidos")}>
            Outros Pedidos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab1" onClick={handleClickPendentes}>
              Pedidos Pendentes
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


const DetalhesItem = () => {
  const { id } = useParams();  
  const [item, setItem] = useState({
    titulo: "",
    descPedido: "",
    recompensaCares: 0,
    fotografiaPA: "",
    nPessoas: 0,
  });
  const [fotoEmprestador, setFotoEmprestador] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/PedidosAjuda/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Resposta da API:", response.data); 

        const data = response.data;
        setItem({
          titulo: data.titulo ?? "",
          descPedido: data.descPedido ?? "",
          recompensaCares: data.recompensaCares ?? 0,
          fotografiaPA: data.fotografiaPA ?? "",
          nPessoas: data.nPessoas,
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        alert('Erro ao carregar os detalhes do pedido.');
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

  const voluntariar = async (pedidoId) => {
    if (!pedidoId) {
      console.error("pedidoId não fornecido");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`/PedidosAjuda/${pedidoId}/Voluntariar`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data);

    } catch (error) {
  console.error("Erro ao se voluntariar:", error);
  if (error.response?.data) {
    alert("Erro: " + error.response.data);
  } else {
    alert("Erro ao se voluntariar para o pedido.");
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
        <h2 className="tituloItem">{item.titulo}</h2>
      </div>

      <img
        className="imgItemDetalhesMI"
        src={getImagemSrc(item.fotografiaPA)}
        alt={item.titulo}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = iconFallback;
        }}
      />

      <div className="infoItem detalhes">
        <div className="infoExtraPedido">
          <div className="infoBox">
            <span className="icon">&#128100;</span>
            <span>{item.nPessoas}</span>
          </div>
          <div className="infoBox">
            <span className="icon">{item.recompensaCares}</span>
            <img src={cares} width={30} height={30} alt="Cares" className="caresIcon" />
          </div>
        </div>
        <button className="botaoAdquirir" onClick={() => voluntariar(id)}>
          Voluntariar
        </button>
      </div>
    </div>

    <div className="colunaDireitaMI">
      <h2 className="tituloItem">Detalhes</h2>
      <div className="caixaDescricao">
        {item.descPedido}
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
