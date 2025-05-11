import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notificacoes.css';
import { api } from '../../utils/axios';

const Header = () => {
  const navigate = useNavigate();

  const goToArchivedNotifications = () => {
    navigate('/notificacoesarq');
  };

  return (
    <header className="notification-header">
      <div className="header-left">
        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <h1 className="header-title">Notificações</h1>
      </div>
      <div className="header-right">
        <div className="notification-bell" onClick={goToArchivedNotifications}> 
          <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12V5a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4m8 4h.01"></path>
          </svg>
        </div>
        <div className="user-profile"></div>
      </div>
    </header>
  );
};


const Notification = ({ id, time, description, onMarkAsRead, isRead }) => {
  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      className={`notification-Card ${isRead ? 'notification-read' : ''}`}
      onClick={handleClick}
    >
      <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z"></path>
      </svg>
      <div className="notification-content">
        <p className="notification-time">{time || 'N/A'}</p>
        <p className="notification-description">{description || 'Sem mensagem'}</p>
      </div>
    </div>
  );
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('Notificacoes/NotificacoesNaoLidas');
        console.log('Notificações não lidas carregadas:', response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error('Erro ao carregar notificações:', err.response?.data || err.message);
        setError(err.response?.data || 'Erro ao carregar as notificações.');
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await api.put(`Notificacoes/MarcarComoLida/${id}`);
      const atualizada = response.data;
  
      setNotifications((prev) =>
        prev.map((n) => (n.notificacaoId === id ? atualizada : n))
      );
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="no-notifications">Não há notificações para mostrar.</div>;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.notificacaoId}
          id={notification.notificacaoId}
          time={new Date(notification.dataMensagem).toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) || 'N/A'}          
          description={notification.mensagem || 'Sem mensagem'}
          onMarkAsRead={markAsRead}
          isRead={notification.lida === 1}
        />
      ))}
    </div>
  );
};

const Notificacoes = ({ backgroundImage }) => {
  return (
    <div className="notifications-page">
      <div className="bgImg" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <Header />
      <NotificationsList />
    </div>
  );
};

export default Notificacoes;
