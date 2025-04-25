import React from "react";
import { FaSearch, FaCubes } from "react-icons/fa";
import "./OutrosEmprestimos.css";

import { useNavigate } from "react-router-dom";



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


export const items = [
  {
    id: 1,
    user: person7,
    title: "Corta Relvas",
    image: cortaRelva,
    description:
      "Precisa aparar o jardim? Emprestamos um corta-relvas! Interessado? Fale connosco!",
    units: 1,
    caresHour: "35/h",
    details:`Corta-relvas Elétrico GreenTech 3000
- Elétrico com fio
- Potência: 1800W
- Largura de corte: 40 cm
- Altura de corte: Ajustável (25-75 mm)
- Capacidade do saco de recolha: 50L
- Peso: 12 kg`
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
    details:`Martelo Clássico GreenTech Standard 500
- Manual, cabo ergonómico em madeira
- Peso da cabeça: 500 g
- Comprimento do cabo: 30 cm
- Material da cabeça: Aço forjado
- Aplicação: Cravar pregos, pequenos trabalhos de demolição
- Peso total: 0,6 kg`
  },
  {
    id: 3,
    user: person9,
    title: "Martelo",
    image: martelo,
    description:
      "Precisa de um martelo? Temos disponíveis, comunique connosco!!",
    units: 3,
    caresHour: "20/h",
    details: `Martelo Clássico GreenTech Standard 500
- Manual, cabo ergonómico em madeira
- Peso da cabeça: 500 g
- Comprimento do cabo: 30 cm
- Material da cabeça: Aço forjado
- Aplicação: Cravar pregos, pequenos trabalhos de demolição
- Peso total: 0,6 kg`
  }
];


const ListaItems = () =>{

  const navigate = useNavigate();

  return(
    <div className="cards">
      {items.map((item) => (
      <div className="card" key={item.id}>
        <div className="userTitleOE">
          <img className="imgUsersOE" src={item.user} width={70} height={70} alt={item.title} />
          <h2>{item.title}</h2>
        </div>
        <img className="imgItemOE" src={item.image} alt={item.title} />

        <p>{item.description}</p>
        <div className="infoItemOE">
          <span><FaCubes /> {item.units}</span>
          <span><img  src={cares} width={30} height={30} alt="Cares" /> {item.caresHour}</span>
        </div>
        <div className="moreInfo">
        <button onClick={() => navigate(`/maisInfo/${item.id}`)}>Mais Informações</button>
        </div>

      </div>  
      
      
      ))}

    </div>
  );
}


function OutrosEmprestimos(){
  return (
    <>
      <HeaderProfileCares />
      <Search />
      <ListaItems />
      
    </>
  );
}

export default OutrosEmprestimos;