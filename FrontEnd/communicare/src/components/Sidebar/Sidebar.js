import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaBox, FaHandHoldingHeart, FaStore, FaUser, FaBell } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/meusEmprestimos', icon: FaBox, label: 'Empréstimos' },
    { path: '/meusPedidos', icon: FaHandHoldingHeart, label: 'Voluntariado' },
    { path: '/loja', icon: FaStore, label: 'Loja' },
    { path: '/profile', icon: FaUser, label: 'Perfil' },
    { path: '/notificacoes', icon: FaBell, label: 'Notificações' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Ícone de Menu para abrir/fechar */}
      <div className="sidebar-icon" onClick={toggleSidebar}>
        <FaBars className="icon" />
      </div>

      {/* Itens de navegação (apenas visíveis quando aberta) */}
      {isOpen && (
        <div className="nav-items">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // Fecha a sidebar ao clicar em um item
              }}
            >
              <item.icon className="icon" />
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;