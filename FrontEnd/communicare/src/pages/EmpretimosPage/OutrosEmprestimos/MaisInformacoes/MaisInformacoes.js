import React from "react";
import { FaCubes } from "react-icons/fa";


import "./MaisInformacoes.css"; // ou cria um novo CSS modular para isso

import cares from '../../../../assets/Cares.png'

import { useParams } from "react-router-dom";
import { pedidos } from "../../OutrosEmprestimos/OutrosEmprestimos";


const DetalhesPedido = () => {

  const {id} = useParams();
  const pedido = pedidos.find((p) => p.id === parseInt(id))

  if(!pedido){
    return <p>Pedido retirado.</p>;
  }

  return(
    <div className="detalhesContainer">
      {/* LADO ESQUERDO */}
      <div className="colunaEsquerda">
        <img className="imgPedidosDetalhes" src={pedido.image} alt={pedido.title}/>

        <div className="infoPedido detalhes">
          <span> <FaCubes/> {pedido.units}</span>
          <span><img src={cares} width={30} height={30} alt="Cares" /> {pedido.caresHour}</span>
        </div>

        <button className="botaoAceitar">Aceitar</button>

      </div>

      {/* LADO DIREITO */}
      <div className="colunaDireita">
        <h2 className="tituloDetalhe">{pedido.title}</h2>

        <div className="descricaoDetalhe">
          <p>Precisa aparar o jardim? Emprestamos um corta-relvas! Interessado? Fale connosco! 🌿</p>
        </div>

        <div className="boxDetalhes">
          <h3>Detalhes</h3>
          <p>
            Corta-relvas Elétrico GreenTech 3000<br />
            - Elétrico com fio<br />
            - Potência: 1800W<br />
            - Largura de corte: 40 cm<br />
            - Altura de corte: Ajustável (25-75 mm)<br />
            - Capacidade do saco de recolha: 50L<br />
            - Peso: 12 kg
          </p>
        </div>
      </div>


    </div>
  )
}

function MaisInformacoes(){
  return (
    <>
      <DetalhesPedido />
      
    </>
  );
}

export default MaisInformacoes;