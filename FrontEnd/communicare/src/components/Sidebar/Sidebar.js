import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaBox, FaHandHoldingHeart, FaStore, FaUser, FaBell, FaHeart, FaHistory  } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/profile', icon: FaUser, label: 'Perfil' },
    { path: '/notificacoes', icon: FaBell, label: 'Notificações' },
    { path: '/meusEmprestimos', icon: FaBox, label: 'Empréstimos' },
    { path: '/meusPedidos', icon: FaHandHoldingHeart, label: 'Voluntariado' },
    { path: '/loja', icon: FaStore, label: 'Loja' },
    { path: '/favoritos', icon: FaHeart, label: 'Favoritos' },
    { path: '/historicoTransacoes', icon: FaHistory, label: 'Histórico Transações' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-icon" onClick={toggleSidebar}>
        <FaBars className="icon" />
      </div>

      {isOpen && (
        <div className="nav-items">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); 
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