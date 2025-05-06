import React from 'react';
import './Notificacoes.css';

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

const Notification = ({ time, title, description }) => {
  return (
    <div className="notification-card">
      <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z"></path>
      </svg>
      <div className="notification-content">
        <p className="notification-time-title">[{time}] {title}</p>
        <p className="notification-description">{description}</p>
      </div>
    </div>
  );
};

const NotificationsList = () => {
  const notifications = [
    {
      time: "10:15",
      title: "Pedido de Empréstimo Aceite",
      description: "O seu pedido de empréstimo foi aprovado! Entre em contato com o doador para combinar o horário.",
    },
    {
      time: "14:30",
      title: "Pedido de Ajuda Publicado",
      description: "O seu pedido de ajuda foi publicado! Voluntários agora podem visualizar e oferecer assistência.",
    },
    {
      time: "16:45",
      title: "Receção dos Créditos",
      description: "Os créditos referentes à sua ação foram recebidos! Consulte seu saldo na plataforma.",
    },
    {
      time: "19:00",
      title: "Compra Confirmada",
      description: "A sua compra na Loja de Pontos foi confirmada! Aguarde mais detalhes sobre a retirada ou entrega.",
    },
    {
      time: "18:10",
      title: "Condições Inválidas",
      description: "O seu pedido de empréstimo não respeita as políticas da aplicação, por isso não pode ser publicado.",
    },
    {
      time: "21:55",
      title: "Voluntariado não compatível",
      description: "O seu pedido de voluntariado não foi aceite devido a não ser compatível com o requisitante do voluntariado.",
    },
  ];

  return (
    <div className="notifications-container">
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          time={notification.time}
          title={notification.title}
          description={notification.description}
        />
      ))}
    </div>
  );
};

const Notificacoes = () => {
  return (
    <div className="notifications-page">
      <Header />
      <NotificationsList />
    </div>
  );
};

export default Notificacoes;