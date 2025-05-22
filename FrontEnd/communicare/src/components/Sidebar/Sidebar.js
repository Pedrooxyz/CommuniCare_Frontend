// src/components/Sidebar/Sidebar.js
import React from 'react';
import './Sidebar.module.css'; // vamos criar já a seguir

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <nav className="sidebar-nav">
          <a href="/profile">Perfil</a>
          <a href="/meusPedidos">Meus Pedidos</a>
          <a href="/meusEmprestimos">Meus Empréstimos</a>
          <a href="/notificacoes">Notificações</a>
          {/* adiciona mais links conforme precisares */}
        </nav>
      </div>

      {/* Overlay escuro para fechar clicando fora */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
