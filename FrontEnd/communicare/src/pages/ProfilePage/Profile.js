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
  const [newPhoto, setNewPhoto] = useState(null); 
  const [meusItens, setMeusItens] = useState([]); 
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

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

  useEffect(() => {
    verificarTipoUtilizador();
  }, []);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userResponse, contactosResponse] = await Promise.all([
          api.get('/Utilizadores/InfoUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/Contactos/ContactosUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("foto", file);

    const token = localStorage.getItem('token');

    try {
      const response = await api.put('/Utilizadores/EditarFoto', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const fotoUrl = response.data?.fotoUtil;
      if (fotoUrl) {
        setUserInfo(prev => ({
          ...prev,
          fotoUtil: fotoUrl
        }));
      }

    } catch (error) {
      console.error("Erro ao atualizar foto", error);
    }
  }
};

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userResponse, contactosResponse] = await Promise.all([
          api.get('/Utilizadores/InfoUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/Contactos/ContactosUtilizador', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);

        const itensResponse = await api.get('/ItensEmprestimo/MeusItens', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeusItens(itensResponse.data);

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
            src={`http://localhost:5182${userInfo?.fotoUtil}`}
            width={190}
            height={190}
            alt="icProfile"
          />
          <label htmlFor="file-input" className="iconplus">
            <img src={plusP} width={45} height={45} alt="iconplus" />
          </label>
          <input
            id="file-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        <div className="cares-box">
          <span>
            <img className="cares" src={cares} width={50} height={50} alt="cares" />
            {userInfo ? userInfo.numCares : "..."}</span>
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

    <div className="buttons-container">
      <button
        className="add-contact"
        onClick={() => navigate('/editar-perfil')}  
      >
        Editar Perfil
      </button>
      {userTipoUtilizadorId === true && (
              <button
                className="add-contact"
                onClick={() => navigate('/GerirUtilizadores')}
              >
                Gerir Contas
              </button>
            )}
          </div>
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
              {meusItens.length > 0 ? (
                meusItens.map((item) => (
                  <div
                    key={item.itemId}
                    className="item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/maisInfo/${item.itemId}`)}
                  >
                    {item.nomeItem}
                  </div>
                ))
              ) : (
                <p className="contact">Nenhum item encontrado.</p>
              )}
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

