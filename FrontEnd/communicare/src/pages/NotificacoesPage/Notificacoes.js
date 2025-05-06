import React, { useState, useEffect } from 'react';
import './Notificacoes.css';
import { api } from '../../utils/axios';

const Header = () => {
  return (
    <header className="notification-header">
      <div className="header-left">
        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <h1 className="header-title">Notificações</h1>
      </div>
      <div className="header-right">
        <div className="notification-bell">
          <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="bell-badge">1</span>
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
      className={`notification-card ${isRead ? 'notification-read' : ''}`}
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
        const response = await api.get('Notificacoes');
        console.log('Notificações carregadas:', response.data);
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
      setNotifications(notifications.map((notif) =>
        notif.id === id ? { ...notif, lida: true } : notif
      ));
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
          time={new Date(notification.dataMensagem).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
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
