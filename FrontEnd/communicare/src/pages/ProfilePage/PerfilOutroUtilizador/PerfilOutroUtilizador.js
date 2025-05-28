import React, { useState, useEffect } from "react";
import "./PerfilOutroUtilizador.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronRight } from 'react-icons/fa';
import { api } from '../../../utils/axios.js';
import defaultProfile from '../../../assets/icon.jpg';
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

const PerfilOutroUtilizador = ({ userId }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await api.get(`/Utilizadores/InfoUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contactosResponse = await api.get(`/Contactos/ContactosUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const helpRequestsResponse = await api.get(`/PedidosAjuda/PedidosDisponiveis/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loansResponse = await api.get(`/ItensEmprestimo/Disponiveis/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);
        setHelpRequests(helpRequestsResponse.data);
        setLoans(loansResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const mapTipoContacto = (tipoId) => {
    switch (tipoId) {
      case 1: return 'Email';
      case 2: return 'Contacto Telefónico';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="profile-container">
      <HeaderProfileCares />
      <div className="main-content">
        <div className="profile-header">
          <img
            className="profile-pic"
            src={userInfo?.FotoUtil ? `http://localhost:5182${userInfo.FotoUtil}` : defaultProfile}
            alt="Foto de perfil"
          />
          <h1>{userInfo?.NomeUtilizador || "Carregando..."}</h1>
        </div>
        <div className="contact-section">
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
        </div>
        <div className="sections">
          <div className="section">
            <h2>Pedidos de Ajuda</h2>
            <div className="buttons">
              <button
                className="action-btn"
                onClick={() => navigate(`/PedirVoluntariado/${userId}`)}
              >
                Pedir Ajuda <FaPlus style={{ marginLeft: '6px' }} />
              </button>
              <button
                className="sub-action"
                onClick={() => navigate(`/MeusPedidos/${userId}`)}
              >
                Gerir Pedidos <FaChevronRight style={{ marginLeft: '6px' }} />
              </button>
            </div>
            <div className="recent">
              <h4>Recentes:</h4>
              {helpRequests.length > 0 ? (
                helpRequests.map((pedido) => (
                  <div
                    key={pedido.pedidoAjudaId}
                    className="item"
                    onClick={() => navigate(`/maisInfoPedidos/${pedido.pedidoId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pedido.titulo}
                  </div>
                ))
              ) : (
                <p>Nenhum pedido disponível.</p>
              )}
            </div>
          </div>
          <div className="section">
            <h2>Empréstimos</h2>
            <div className="buttons">
              <button
                className="action-btn"
                onClick={() => navigate(`/PedirEmprestimo/${userId}`)}
              >
                Adicionar Item <FaPlus style={{ marginLeft: '6px' }} />
              </button>
              <button
                className="sub-action"
                onClick={() => navigate(`/MeusEmprestimos/${userId}`)}
              >
                Gerir Empréstimos <FaChevronRight style={{ marginLeft: '6px' }} />
              </button>
            </div>
            <div className="recent">
              <h4>Recentes:</h4>
              {loans.length > 0 ? (
                loans.map((item) => (
                  <div
                    key={item.itemId}
                    className="item"
                    onClick={() => navigate(`/maisInfo/${item.itemId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.nomeItem}
                  </div>
                ))
              ) : (
                <p>Nenhum item encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilOutroUtilizador;