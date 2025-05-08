import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronRight } from 'react-icons/fa'; 
import React, { useState, useEffect } from "react";
import { api } from '../../utils/axios.js';

import msgNot from '../../assets/messageNotification.png';
import notification from '../../assets/notification.jpg';

import person1 from '../../assets/person1.jpg';
import plusP from '../../assets/plusProfile.png';

import cares from '../../assets/Cares.png';
import loja from '../../assets/loja.png';

const HeaderNot = () => {
  const navigate = useNavigate();

  return (
    <header className="headerNot">
      {/*<img 
        className="imgHeader" 
        src={msgNot} 
        width={45} 
        height={45} 
        alt="Mensagens" 
      />*/}
      
      <button 
        className="imgButton" 
        onClick={() => navigate("/notificacoes")} 
        aria-label="Ver notificações"
      >
        <img 
          className="imgHeader" 
          src={notification} 
          width={45} 
          height={45} 
          alt="Notificações" 
        />
      </button>
    </header>
  );
};

const mapTipoContacto = (tipoId) => {
  switch (tipoId) {
    case 1: return 'Email';
    case 2: return 'Contacto Telefónico';
  }
};

const DadosUserPI = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // Vai buscar tanto os dados do utilizador como os contactos em simultâneo
        const [userResponse, contactosResponse] = await Promise.all([
          api.get('/Utilizadores/InfoUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/Utilizadores/ContactosUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("User info recebida:", userResponse.data);
        console.log("Contactos recebidos:", contactosResponse.data);

        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      <div className="info">
        <div className="IconProfile">
          <img
            className="icPerson"
            src={userInfo ? `${userInfo.fotoUtil}` : '../../../../assets/icon.jpg'}
            width={190}
            height={190}
            alt="icProfile"
          />
          <img className="iconplus" src={plusP} width={45} height={45} alt="iconplus" />
        </div>

        <div className="cares-box">
          <span>
            <img className="cares" src={cares} width={50} height={50} alt="cares" />
            {userInfo ? userInfo.numCares : "..."}
          </span>
          <span>
            <strong>Loja:</strong>
            <img
              className="loja"
              src={loja}
              width={50}
              height={50}
              alt="loja"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/Loja')}
            />
          </span>
        </div>
      </div>

      <div className="gridProfile">
        {/* Coluna de Perfil */}
        <div className="cardPofile profile">
          <h2 className="name">{userInfo ? userInfo.nomeUtilizador : "..."}</h2>
          <h3>Contactos:</h3>

          {contactos.length > 0 ? (
            contactos.map((contacto, index) => (
              <p key={index} className="contact">
                {mapTipoContacto(contacto.tipoContactoId)}: {contacto.numContacto}
              </p>
            ))
          ) : (
            <p className="contact">Nenhum contacto disponível</p>
          )}

          <button className="add-contact">Editar Perfil</button>
          <span className="ellipsis"></span>
        </div>

        {/* Coluna de Voluntariados */}
        <div className="cardPofile">
          <h2 className="section">Voluntariados</h2>

          <div className="botoes">
            <button className="action-btn" onClick={() => navigate('/PedirVoluntariado')}>
              Pedir Voluntariado <FaPlus style={{ marginLeft: '6px' }} />
            </button>

            <button className="sub-action" onClick={() => navigate('/outrosPedidos')}>
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
        <div className="cardPofile">
          <h2 className="section">Empréstimos</h2>

          <div className="botoes">
            <button className="action-btn" onClick={() => navigate('/PedirEmprestimo')}>
              Adicionar Empréstimos <FaPlus style={{ marginLeft: '6px' }} />
            </button>

            <button className="sub-action" onClick={() => navigate('/MeusEmprestimos')}>
              Empréstimos <FaChevronRight style={{ marginLeft: '6px' }} />
            </button>
          </div>

          <div className="recent">
            <h4 className="recent-name">Recentes:</h4>
            <div className="recent-items">
              <div className="item">Secador</div>
              <div className="item">Martelo</div>
              <div className="item">Corta relva</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Profile() {
  return (
    <>
      <HeaderNot />
      <DadosUserPI />
    </>
  );
}

export default Profile;
