import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './NotificacoesArq.css';
import { api } from '../../../utils/axios';

const Header = () => {
  const navigate = useNavigate(); 

  const goToNotifications = () => {
    navigate('/notificacoes'); 
  };

  return (
    <header className="notification-header">
      <div className="header-left">
        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <h1 className="header-title">Notificações Arquivadas</h1>
      </div>
      <div className="header-right">
        <div className="notification-bell" onClick={goToNotifications}>
        <svg className="bell-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
        <div className="user-profile"></div>
      </div>
    </header>
  );
};

const Notification = ({ time, description, lida }) => {
    const notificationClass = lida === 1 ? "notification-card notification-read" : "notification-card";
  
    return (
      <div className={notificationClass}>
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

const ArchivedNotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('Notificacoes'); 
        console.log('Notificações arquivadas carregadas:', response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error('Erro ao carregar notificações arquivadas:', err.response?.data || err.message);
        setError(err.response?.data || 'Erro ao carregar as notificações.');
      }
    };

    fetchNotifications();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="no-notifications">Não há notificações arquivadas para mostrar.</div>;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.notificacaoId}
          time={new Date(notification.dataMensagem).toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) || 'N/A'}
          description={notification.mensagem || 'Sem mensagem'}
          lida={notification.lida} 
        />
      ))}
    </div>
  );  
};

const NotificacoesArq = ({ backgroundImage }) => {
  return (
    <div className="notifications-arq-page">
      <div className="bgImg" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <Header />
      <ArchivedNotificationsList />
    </div>
  );
};

export default NotificacoesArq;
