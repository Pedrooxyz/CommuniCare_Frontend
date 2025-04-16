import React from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import "./OutrosEmpretimos.css";



import person1 from '../../../assets/person1.jpg'
import cares from '../../../assets/Cares.png'

import person7 from '../../../assets/person7.png'
import person8 from '../../../assets/person8.png'
import person9 from '../../../assets/person9.png'


import martelo from '../../../assets/martelo.jpg'
import cortaRelva from '../../../assets/cortaRelva.jpg'
import compressor from '../../../assets/compressor.jpg'



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


const pedidos = [
  {
    id: 1,
    user: person7,
    title: "Corta Relvas",
    image: cortaRelva,
    description:
      "Precisa aparar o jardim? Emprestamos um corta-relvas! Interessado? Fale connosco!",
    units: 1,
    caresHour: "35/h",
    
  },
  {
    id: 2,
    user: person8,
    title: "Compressor",
    image: compressor,
    description:
      "Precisa encher pneus ou usar ferramentas pneumáticas? Entre em contato!",
    units: 2,
    caresHour: "40/h",
    
  },
  {
    id: 3,
    user: person9,
    title: "Mover móvel",
    image: martelo,
    description:
      "Precisa de um martelo? Temos disponíveis, comunique connosco!!",
    units: 3,
    caresHour: "20/h",
    
  }
];


const ListaPedidos = () =>{
  return(
    <div className="cards">
      {pedidos.map((pedido) => (
      <div className="card" key={pedido.id}>
        <div className="userTitle">
          <img className="imgUsers" src={pedido.user} width={70} height={70} alt={pedido.title} />
          <h2>{pedido.title}</h2>
        </div>
        <img className="imgPedidos" src={pedido.image} alt={pedido.title} />

        <p>{pedido.description}</p>
        <div className="infoPedido">
          <span><FaCubes /> {pedido.units}</span>
          <span><img  src={cares} width={30} height={30} alt="Cares" /> {pedido.caresHour}</span>
        </div>
        <div className="moreInfo">
          <button>Mais Informações</button>
        </div>

      </div>  
      
      
      ))}

    </div>
  );
}


function OutrosEmpretimos(){
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaPedidos />
      
    </>
  );
}

export default OutrosEmpretimos;