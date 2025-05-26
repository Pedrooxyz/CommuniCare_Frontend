import React, { useEffect, useState } from "react";
import "./HistoricoLoja.css";
import "./../Loja.css";

import cares from "../../../assets/Cares.png";
import iconFallback from "../../../assets/icon.jpg";
import coracaofv from "../../../assets/coracaofv.jpg"; // Coração não favoritado
import coracaofv2 from "../../../assets/coracaofv2.jpg"; // Coração favoritado
import { api } from "../../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

function Loja() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [lojas, setLojas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomeLoja, setNomeLoja] = useState("");
  const [descLoja, setDescLoja] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data);
      } catch (error) {
        console.error("Erro ao verificar o tipo de utilizador", error);
        setIsAdmin(false);
      }
    };

    const buscarLojas = async () => {
      try {
        const response = await api.get("/Lojas");
        setLojas(response.data);
      } catch (error) {
        console.error("Erro ao buscar lojas", error);
      }
    };

    verificarAdmin();
    buscarLojas();
  }, []);

  const handleCriarLoja = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/Lojas/CriarLoja-(admin)",
        {
          nomeLoja,
          descLoja,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Loja criada com sucesso!");
      setLojas((prev) => [...prev, response.data]);
      setNomeLoja("");
      setDescLoja("");
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao criar loja", error);
    }
  };

  const handleAtivarLoja = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/Lojas/AtivarLoja-(admin)/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Loja ativada com sucesso!");
      setLojas((prev) =>
        prev.map((loja) =>
          loja.id === id ? { ...loja, estado: "Ativo" } : loja
        )
      );
    } catch (error) {
      console.error("Erro ao ativar loja", error);
    }
  };

  return (
    <div className="container-loja">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Histórico de Lojas</h1>

      {isAdmin && !mostrarFormulario && (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="btn-criar-loja"
        >
          Criar Nova Loja
        </button>
      )}

      {mostrarFormulario && (
        <form onSubmit={handleCriarLoja} className="form-criar-loja">
          <div>
            <label htmlFor="nomeLoja">Nome da Loja:</label>
            <input
              type="text"
              id="nomeLoja"
              value={nomeLoja}
              onChange={(e) => setNomeLoja(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="descLoja">Descrição da Loja:</label>
            <textarea
              id="descLoja"
              value={descLoja}
              onChange={(e) => setDescLoja(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-salvar">
            Guardar Loja
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      <div className="lista-lojas">
  {lojas.map((loja) => (
    <div key={loja.lojaId} className="loja-item">
      <span>{`${loja.nomeLoja}`}</span>

      {loja.estado === 0 && isAdmin && (
        <button
          onClick={() => handleAtivarLoja(loja.lojaId)}
          className="btn-ativar"
        >
          Ativar Loja
        </button>
      )}

      {loja.estado === 1 && (
        <span className="texto-ativada">Loja Ativada</span>
      )}
    </div>
  ))}
</div>
    </div>
  );
}

export default Loja;