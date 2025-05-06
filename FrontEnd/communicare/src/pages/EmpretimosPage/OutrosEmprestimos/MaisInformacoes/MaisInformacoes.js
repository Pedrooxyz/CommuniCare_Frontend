import React, { useEffect, useState } from "react";
import { FaCubes, FaSearch } from "react-icons/fa";

import "./MaisInformacoes.css";

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
  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>

      <div className="tabs">
        <div className="choose">
          <button className="tab ">Meus Empréstimos</button>
          <button className="tab active">Outros Emprestimos</button>
          <button className="tab ">Pendentes</button>
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
        setItem(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do item:', error);
      }
    };

    const fetchFotoEmprestador = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/ItemEmprestimo/${id}/foto-emprestador`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Foto do emprestador recebida:", response.data);

        // Montar a URL completa da foto
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

        <button className="botaoAceitar">Aceitar</button>
      </div>

      {/* LADO DIREITO */}
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.nomeItem}</h2>

        <div className="descricaoDetalhe">
          <p className="decriptionText">{item.descItem || "Sem descrição disponível."}</p>
        </div>

        {item.detalhes && (
          <>
            <h3 className="h3Detalhes">Detalhes</h3>
            <div className="boxDetalhes">
              <pre className="detalhesText">{item.detalhes}</pre>
            </div>
          </>
        )}
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
