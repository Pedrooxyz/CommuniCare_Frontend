import React, { useEffect, useState } from "react";
import "./GerirUtilizadores.css";
import { api } from "../../utils/axios";

function GerirUtilizadoresPendentes() {
  const [pendentes, setPendentes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPendentes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("Utilizadores/ListarPendentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendentes(response.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores pendentes:", error);
      alert("Erro ao buscar utilizadores pendentes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);


  const aprovarUtilizador = async (id) => {
    if (!window.confirm("Tem certeza que quer aprovar este utilizador?")) return;
    try {
      await api.put(`Utilizadores/AprovarUtilizador-(admin)/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Utilizador aprovado com sucesso.");
      fetchPendentes();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar utilizador.");
    }
  };

  const rejeitarUtilizador = async (id) => {
    if (!window.confirm("Tem certeza que quer rejeitar este utilizador?")) return;
    try {
      await api.put(`Utilizadores/RejeitarUtilizador-(admin)/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Utilizador rejeitado com sucesso.");
      fetchPendentes();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      alert("Erro ao rejeitar utilizador.");
    }
  };

  return (
    <div className="container-gerir-utilizadores">
      <h1 className="titulo-principal">Gerir Utilizadores Pendentes</h1>

      {isLoading ? (
        <p>A carregar utilizadores...</p>
      ) : pendentes.length === 0 ? (
        <p>Não há utilizadores pendentes de aprovação.</p>
      ) : (
        <table className="tabela-utilizadores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Rua</th>
              <th>Nº Porta</th>
              <th>Código Postal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendentes.map((u) => (
              <tr key={u.utilizadorId}>
                <td>{u.nomeUtilizador}</td>
                <td>{u.morada?.rua || "Sem rua"}</td>
                <td>{u.morada?.numPorta || "Sem nº porta"}</td>
                <td>{u.morada?.cPostal || "Sem código postal"}</td>
                <td>
                  <button className="btn-aprovar" onClick={() => aprovarUtilizador(u.utilizadorId)}>Aprovar</button>
                  <button className="btn-rejeitar" onClick={() => rejeitarUtilizador(u.utilizadorId)}>Rejeitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GerirUtilizadoresPendentes;
