import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./DetalhesArtigo.css";

import cares from '../../../assets/Cares.png';
import { api } from '../../../utils/axios.js';

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
        }}
      />
    </header>
  );
};

const DetalhesItem = () => {
  const { artigoId } = useParams(); // Pegando o ID do artigo diretamente da URL
  const [item, setItem] = useState({
    nomeArtigo: "",
    descArtigo: "",
    custoCares: 0,
    fotografiaArt: "",
  });
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/Artigos/${artigoId}`, { // Utilizando o artigoId da URL para buscar os detalhes do artigo
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {  // A resposta é um objeto, não um array
          const data = response.data;  // Não é mais necessário pegar [0], pois a resposta já é um objeto

          console.log("Item carregado da API:", data);

          setItem({
            nomeArtigo: data.nomeArtigo ?? "",
            descArtigo: data.descArtigo ?? "",
            custoCares: data.custoCares ?? 0,
            fotografiaArt: data.fotografiaArt ?? "",
          });
        } else {
          throw new Error("Item não encontrado.");
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
        alert('Erro ao carregar os detalhes do item.');
      }
    };

    fetchItem();
  }, [artigoId]);  // A dependência é o artigoId para fazer a busca sempre que o ID mudar

  const handleComprar = (artigoId) => {
    setArtigoSelecionado(artigoId);
    setMostrarPopup(true);
  };

  return (
    <div className="detalhesContainer">
      {/* LADO ESQUERDO */}
      <div className="colunaEsquerda">
        <h2 className="tituloItem">{item.nomeArtigo}</h2>

        <img className="imgItemDetalhes" src={item.fotografiaArt} alt={item.nomeArtigo} />

        <div className="infoItem detalhes">
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.custoCares}/h</span>
        </div>

        <button className="botaoComprar" onClick={() => handleComprar(item.artigoId)}>
          Comprar
        </button>
      </div>

      <div className="colunaDireita">
        <h2 className="tituloItem">Detalhes do Artigo</h2>
        <div className="caixaDescricao">
          {item.descArtigo}
        </div>
      </div>

      {/* Exibir o popup de compra */}
      {mostrarPopup && (
        <div className="popup">
          {/* Adicionar conteúdo do popup aqui */}
          <p>Compra do artigo {artigoSelecionado} em andamento...</p>
        </div>
      )}
    </div>
  );
};

function DetalhesArtigo() {
  return (
    <>
      <HeaderProfileCares />
      <DetalhesItem />
    </>
  );
}

export default DetalhesArtigo;
