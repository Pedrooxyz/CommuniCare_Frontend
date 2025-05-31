import React, { useEffect, useState } from "react";
import "./GerirUtilizadores.css";
import { api } from "../../utils/axios";
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../components/ToastBar/ToastBar.js";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal.js";

function GerirUtilizadoresPendentes() {
  const [pendentes, setPendentes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", action: null });

  const token = localStorage.getItem("token");

  const fetchPendentes = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }
      const response = await api.get("Utilizadores/ListarPendentes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Utilizadores pendentes carregados:", response.data);
      setPendentes(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar utilizadores pendentes:", error);
      setToast({
        message: error.message || "Erro ao buscar utilizadores pendentes.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  const aprovarUtilizador = (id) => {
    console.log("Botão Aprovar clicado para utilizadorId:", id);
    if (!id) {
      console.error("ID do utilizador inválido:", id);
      setToast({
        message: "ID do utilizador inválido.",
        type: "error",
      });
      return;
    }
    setModal({
      isOpen: true,
      message: "Tem certeza que quer aprovar este utilizador?",
      action: async () => {
        try {
          if (!token) {
            throw new Error("Token de autenticação não encontrado.");
          }
          await api.put(`Utilizadores/AprovarUtilizador-(admin)/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Utilizador aprovado com sucesso:", id);
          setToast({
            message: "Utilizador aprovado com sucesso.",
            type: "success",
          });
          setTimeout(() => {
            fetchPendentes();
          }, 3000);
        } catch (error) {
          console.error("Erro ao aprovar utilizador:", error);
          setToast({
            message: error.response?.data || "Erro ao aprovar utilizador.",
            type: "error",
          });
        }
        setModal({ isOpen: false, message: "", action: null });
      },
    });
    console.log("Estado modal atualizado para aprovar:", { isOpen: true, message: "Tem certeza que quer aprovar este utilizador?" });
  };

  const rejeitarUtilizador = (id) => {
    console.log("Botão Rejeitar clicado para utilizadorId:", id);
    if (!id) {
      console.error("ID do utilizador inválido:", id);
      setToast({
        message: "ID do utilizador inválido.",
        type: "error",
      });
      return;
    }
    setModal({
      isOpen: true,
      message: "Tem certeza que quer rejeitar este utilizador?",
      action: async () => {
        try {
          if (!token) {
            throw new Error("Token de autenticação não encontrado.");
          }
          await api.put(`Utilizadores/RejeitarUtilizador-(admin)/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Utilizador rejeitado com sucesso:", id);
          setToast({
            message: "Utilizador rejeitado com sucesso.",
            type: "success",
          });
          setTimeout(() => {
            fetchPendentes();
          }, 3000);
        } catch (error) {
          console.error("Erro ao rejeitar utilizador:", error);
          setToast({
            message: error.response?.data || "Erro ao rejeitar utilizador.",
            type: "error",
          });
        }
        setModal({ isOpen: false, message: "", action: null });
      },
    });
    console.log("Estado modal atualizado para rejeitar:", { isOpen: true, message: "Tem certeza que quer rejeitar este utilizador?" });
  };

  const handleCancelModal = () => {
    console.log("Modal cancelado");
    setModal({ isOpen: false, message: "", action: null });
  };

  return (
    <div className="container-gerir-utilizadores">
      <HeaderProfileCares />
      <h1 className="titulo-principalG">Gerir Utilizadores Pendentes</h1>

      {isLoading ? (
        <p>A carregar utilizadores...</p>
      ) : pendentes.length === 0 ? (
        <p>Não há utilizadores pendentes de aprovação.</p>
      ) : (
        <div className="tabela-container">
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
                  <td>{u.nomeUtilizador || "Sem nome"}</td>
                  <td>{u.morada?.rua || "Sem rua"}</td>
                  <td>{u.morada?.numPorta || "Sem nº porta"}</td>
                  <td>{u.morada?.cPostal || "Sem código postal"}</td>
                  <td className="AprovarRejeitar">
                    <button className="btn-aprovar" onClick={() => aprovarUtilizador(u.utilizadorId)}>Aprovar</button>
                    <button className="btn-rejeitar" onClick={() => rejeitarUtilizador(u.utilizadorId)}>Rejeitar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {modal.isOpen && (
        <ConfirmModal
          isOpen={modal.isOpen}
          message={modal.message}
          onConfirm={modal.action}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
}

export default GerirUtilizadoresPendentes;