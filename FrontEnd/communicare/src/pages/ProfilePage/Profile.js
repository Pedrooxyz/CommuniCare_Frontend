import "./Profile.css";
//import { useState, useEffect } from "react";

import { FaPlus, FaChevronRight } from 'react-icons/fa'; 


import msgNot from '../../assets/messageNotification.png'
import notification from '../../assets/notification.png'

import person1 from '../../assets/person1.jpg'
import plusP from '../../assets/plusProfile.png'

import cares from '../../assets/Cares.png'
import loja from '../../assets/loja.png'


const HeaderNot = () => {
  return(
    <header>
     <img className="imgHeader" src={msgNot} width={45} height={45} alt="msgNot" />
     <img className="imgHeader" src={notification} width={45} height={45} alt="Notifications" />
    </header>
  )
  
}

const DadosUserPI = () =>{
  return(
    <div>

      <div className="info">

      <div className="IconProfile">
        <img className="icPerson" src={person1} width={190} height={190} alt="icProfile" />
        <img className="iconplus" src={plusP} width={45} height={45} alt="iconplus" />
      </div>

      <div className="cares-box">
          <span>
          <img className="cares" src={cares} width={50} height={50} alt="icProfile" />
            _ _ _ 100 cares
          </span>
          <span>
            <strong>Loja:</strong> 
            <img className="loja" src={loja} width={50} height={50} alt="icProfile" />
          </span>
        </div>
     

     </div>

      <div className="grid">
        {/* Coluna de Perfil */}
        <div className="card profile">
          <h2 className="name">Carla Maria Silva</h2>
          <h3>Contactos:</h3>
          <p className="contact">email: carla11silva@gmail.com</p>
          <p className="contact">Telemovel 1: 913457001</p>
          <button className="add-contact">+ Adicionar Contacto</button>
          <span className="ellipsis">(...)</span>
        </div>

        {/* Coluna de Voluntariados */}
        <div className="card">
          <h2 className="section">Voluntariados</h2>
          
          <div className="botoes">
            <button className="action-btn">
                Pedir Voluntariado <FaPlus style={{ marginLeft: '6px' }} />
            </button>

            <button className="sub-action">
                Pedidos <FaChevronRight style={{ marginLeft: '6px' }} />
            </button>
          </div>

            <div className="recent">
            <h4 className="recent-name">Recentes:</h4>
            <div className="recent-items">
                <div className="item">Fuga de água</div>
                <div className="item">Cortar relva</div>
                <div className="item">Mudar a Lâmpada</div>
                <div className="item">Mover Movel</div>
            </div>
            </div>

        </div>

        {/* Coluna de Empréstimos */}
        <div className="card">
            <h2 className="section">Empretimos</h2>

            <div className="botoes">
            <button className="action-btn">
              Adicionar Empréstimos <FaPlus style={{ marginLeft: '6px' }}/> 
            </button>

            <button className="sub-action">
              Empréstimos <FaChevronRight style={{ marginLeft: '6px' }} />
            </button>

            </div>

            <div className="recent">
            <h4 className="recent-name">Recentes:</h4>
            <div className="recent-items">
                <div className="item">Secador</div>
                <div className="item">Martelo</div>
                <div className="item">Corta relva</div>
                <div className="item">Pistola de encher pneus</div>
            </div>
            </div>


          </div>
      </div>

    </div>
      
  )
}



function Profile() {
  return (
    <>
      <HeaderNot />
      <DadosUserPI />
    </>
  );
}



export default Profile
