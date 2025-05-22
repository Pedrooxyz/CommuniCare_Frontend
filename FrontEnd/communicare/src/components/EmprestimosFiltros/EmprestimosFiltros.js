import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from './../../utils/axios.js';
import "./EmprestimosFiltros.css";
import Filtros from "../../assets/Filtros.jpg";
import {PopUpBarra} from "./../PopUpPage/PopUp.js"; 



const Search = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [showFiltros, setShowFiltros] = useState(false);
  const [maxCares, setMaxCares] = useState(2000);
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

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos");
    } else {
      alert("Apenas administradores podem aceder a esta página!");
    }
  };

  const handleClosePopup = (novoMaxCares) => {
    if (novoMaxCares !== undefined) {
      setMaxCares(novoMaxCares);
    }
    setShowFiltros(false);
  };

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabs">
        <div className="choose">
          <button
            className="tab active"
            onClick={() => navigate("/meusEmprestimos")}
          >
            Meus Empréstimos
          </button>
          <button className="tab" onClick={() => navigate("/outrosEmprestimos")}>
            Outros Emprestimos
          </button>
          {userTipoUtilizadorId === true && (
            <button className="tab" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} 
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="search-wrapper">
          <button
            className="filtros-button"
            onClick={() => setShowFiltros(true)}
          >
            <img src={Filtros} alt="Filtros" className="filtros-icon" />
          </button>

          {showFiltros && (
            <PopUpBarra
              maxCares={maxCares}
              onClose={handleClosePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
