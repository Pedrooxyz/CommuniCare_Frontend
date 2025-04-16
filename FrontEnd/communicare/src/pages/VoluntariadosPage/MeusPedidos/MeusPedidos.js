import React from "react";
import { FaSearch } from "react-icons/fa";
import "./MeusPedidos.css";



import person1 from '../../../assets/person1.jpg'
import cares from '../../../assets/Cares.png'

import person2 from '../../../assets/person2.png'
import person3 from '../../../assets/person3.png'
import person4 from '../../../assets/person4.png'


import cano from '../../../assets/cano.jpg'
import cortarRelva from '../../../assets/cortarRelva.webp'
import moverMovel from '../../../assets/moverMovel.jpg'



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
      <h1 >Voluntariados</h1>
      </div>

      <div className="tabs">
        
          <div className="choose">
            <button className="tab ">Meus Pedidos</button>
            <button className="tab active">Outros Pedidos</button>
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
    user: person2,
    title: "Fuga de água",
    image: cano,
    description:
      "Preciso de ajuda com o cano da cozinha. Está sempre a pingar, mesmo quando a torneira está desligada.",
    volunteers: 1,
    points: 15,
    time: "13:00h",
    date: "15/03/2025"
  },
  {
    id: 2,
    user: person3,
    title: "Cortar relva",
    image: cortarRelva,
    description:
      "Preciso de ajuda a relva cortar a relva do meu jardim. Dei um jeito as costas.",
    volunteers: 1,
    points: 20,
    time: "16:00h",
    date: "16/03/2025"
  },
  {
    id: 3,
    user: person4,
    title: "Mover móvel",
    image: moverMovel,
    description:
      "Preciso de ajuda para mover este móvel. É bastante pesado e não consigo movê-lo sozinho.",
    volunteers: 3,
    points: 20,
    time: "9:00h",
    date: "16/03/2025"
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
          <span>👤 {pedido.volunteers}</span>
          <span><img  src={cares} width={30} height={30} alt="Cares" /> {pedido.points}</span>
        </div>
        <div className="datetime">
          <span>🕒 {pedido.time}</span>
          <span>📅 {pedido.date}</span>
        </div>

      </div>  
      
      
      ))}

    </div>
  );
}


function MeusPedidos(){
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaPedidos />
      
    </>
  );
}

export default MeusPedidos;