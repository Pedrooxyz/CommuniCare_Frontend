import React from "react";
import { FaCubes, FaSearch } from "react-icons/fa";



import "./MaisInformacoes.css"; // ou cria um novo CSS modular para isso

import person1 from '../../../../assets/person1.jpg'
import cares from '../../../../assets/Cares.png'

import { useParams } from "react-router-dom";
import { items } from "../../OutrosEmprestimos/OutrosEmprestimos";

const HeaderProfileCares = () => {
  return(
    <header>
     <p>100</p><img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
     <img className="imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
    </header>
  )
  
}

const Search = () => {
  return(
    <div>
      
      <div className="mainName">
      <h1 >Empréstimos</h1>
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
  )
}

const DetalhesItem = () => {

  const {id} = useParams();
  const item = items.find((p) => p.id === parseInt(id))

  if(!item){
    return <p>Pedido retirado.</p>;
  }

  return(
    <div className="detalhesContainer">
      {/* LADO ESQUERDO */}
      <div className="colunaEsquerda">
        <div className="userTitle">
          <img className="imgUsers" src={item.user} alt={item.user} width={70} height={70}/>
          <h2 className="tituloItem">{item.title}</h2>
        </div>
        <img className="imgItemDetalhes" src={item.image} alt={item.title} />

        <div className="infoItem detalhes">
          <span> <FaCubes/> {item.units}</span>
          <span><img src={cares} width={30} height={30} alt="Cares" /> {item.caresHour}</span>
          
        </div>

        <button className="botaoAceitar">Aceitar</button>

      </div>

      {/* LADO DIREITO */}
      <div className="colunaDireita">
        <h2 className="tituloItem">{item.title}</h2>

        <div className="descricaoDetalhe">
          <p className="decriptionText">{item.description}</p>
        </div>

        <h3 className="h3Detalhes">Detalhes</h3>
        {item.details && (
          <div className="boxDetalhes">
            
            <pre className="detalhesText">{item.details}</pre>
          </div>
        )}
      </div>


    </div>
  )
}

function MaisInformacoes(){
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <DetalhesItem />
      
    </>
  );
}

export default MaisInformacoes;