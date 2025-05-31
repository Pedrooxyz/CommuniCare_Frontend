import React, { useEffect, useState } from "react";
import "./Favoritos.css";
import cares from "../../../assets/Cares.png";
import coracaofv2 from "../../../assets/coracaofv2.jpg";
import { api } from "../../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../components/ToastBar/ToastBar.js";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.js";

function Favoritos() {
  const [artigos, setArtigos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [transacaoId, setTransacaoId] = useState("");
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", action: null });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoritos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("/Favoritos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtigos(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setToast({
          message: error.message || "Erro ao carregar artigos favoritos.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  const handleRemoverFavorito = (artigoId) => {
    console.log("Botão Remover Favorito clicado para artigoId:", artigoId);
    setModal({
      isOpen: true,
      message: "Deseja remover este artigo dos favoritos?",
      action: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token de autenticação não encontrado.");
          await api.delete(`/Favoritos/${artigoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setToast({
            message: "Artigo removido dos favoritos.",
            type: "success",
          });
            setArtigos((prev) => prev.filter((artigo) => artigo.artigoId !== artigoId));
        } catch (error) {
          console.error("Erro ao remover favorito:", error);
          let message = "Erro ao remover artigo dos favoritos.";
          if (error.response?.status === 404) {
            message = "Artigo não encontrado nos favoritos.";
          }
          setToast({ message, type: "error" });
        }
        setModal({ isOpen: false, message: "", action: null });
      },
    });
    console.log("Estado modal atualizado para remoção:", {
      isOpen: true,
      message: "Deseja remover este artigo dos favoritos?",
    });
  };

  const handleComprar = (artigoId) => {
    console.log("Botão Comprar clicado para artigoId:", artigoId);
    setArtigoSelecionado(artigoId);
    setMostrarPopup(true);
  };

  const confirmarCompra = async () => {
    console.log("Confirmando compra para artigoId:", artigoSelecionado);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const response = await api.post(
        "/Vendas/Comprar",
        { artigosIds: [artigoSelecionado] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.sucesso) {
        setToast({
          message: "Compra realizada com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          setTransacaoId(response.data.transacaoId);
          setMostrarPopup(false);
          setMostrarEscolhaComprovativo(true);
        }, 3000);
      } else {
        setToast({
          message: "Erro na compra: " + response.data.erro,
          type: "error",
        });
        setMostrarPopup(false);
      }
    } catch (error) {
      console.error("Erro ao realizar a compra:", error);
      setToast({
        message: error.response?.data || "Erro ao realizar a compra.",
        type: "error",
      });
      setMostrarPopup(false);
    }
  };

  const cancelarCompra = () => {
    console.log("Compra cancelada");
    setMostrarPopup(false);
    setArtigoSelecionado(null);
  };

  const handleMaisDetalhes = (artigoId) => {
    navigate(`/detalhesArtigo/${artigoId}`);
  };

  const enviarComprovativoEmail = async () => {
    console.log("Enviando comprovativo por email para transacaoId:", transacaoId);
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }

    try {
      const response = await api.get(`/Vendas/Comprovativo/Email/${transacaoId}`);
      setToast({
        message: response.data.mensagem || "Comprovativo enviado por email com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao enviar comprovativo por email:", error);
      setToast({
        message: "Erro ao enviar comprovativo por email.",
        type: "error",
      });
    }
    setMostrarEscolhaComprovativo(false);
  };

  const downloadComprovativoPDF = async () => {
    console.log("Baixando comprovativo PDF para transacaoId:", transacaoId);
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }

    try {
      const response = await api.get(`/Vendas/Comprovativo/Download/${transacaoId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ComprovativoCompra.pdf");
      document.body.appendChild(link);
      link.click();
      setToast({
        message: "Comprovativo baixado com sucesso!",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao baixar comprovativo em PDF:", error);
      setToast({
        message: "Erro ao baixar comprovativo em PDF.",
        type: "error",
      });
    }
    setMostrarEscolhaComprovativo(false);
  };

  const handleCancelModal = () => {
    console.log("Modal cancelado");
    setModal({ isOpen: false, message: "", action: null });
  };

  return (
    <div className="container-favoritos">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Meus Favoritos</h1>

      {isLoading ? (
        <p>A carregar favoritos...</p>
      ) : (
        <div className="conteudo-favoritos">
          {artigos.length === 0 ? (
            <p className="sem-favoritos">Sem artigos favoritos.</p>
          ) : (
            artigos.map((artigo) => (
              <div key={artigo.artigoId} className="card-artigo">
                <div className="favorito-icon">
                  <img
                    src={coracaofv2}
                    alt="Remover dos favoritos"
                    className="heart-icon"
                    onClick={() => handleRemoverFavorito(artigo.artigoId)}
                  />
                </div>
                <h3>{artigo.nomeArtigo}</h3>
                <div className="img-artigo">
                  {artigo.fotografiaArt && artigo.fotografiaArt !== "string" ? (
                    <img
                      src={`data:image/jpeg;base64,${artigo.fotografiaArt}`}
                      alt={artigo.nomeArtigo}
                    />
                  ) : (
                    <span className="no-img">Sem imagem</span>
                  )}
                </div>
                <div className="custo-artigo2">
                  <img src={cares} alt="Cares" className="icon" />
                  <strong>{artigo.custoCares}</strong>
                </div>
                <div className="botoes-artigo2">
                  <button
                    className="botao-mais-detalhes2"
                    onClick={() => handleMaisDetalhes(artigo.artigoId)}
                  >
                    Mais Detalhes
                  </button>
                  <button
                    className="botao-comprar"
                    onClick={() => handleComprar(artigo.artigoId)}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {mostrarPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Tem a certeza de que deseja comprar este artigo?</p>
            <div className="popup-buttons">
              <button onClick={confirmarCompra} className="botao-confirmar">
                Sim
              </button>
              <button onClick={cancelarCompra} className="botao-cancelar">
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarEscolhaComprovativo && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Como deseja receber o comprovativo?</p>
            <div className="popup-buttons">
              <button onClick={enviarComprovativoEmail} className="botao-confirmar">
                Por E-mail
              </button>
              <button onClick={downloadComprovativoPDF} className="botao-confirmar">
                Baixar PDF
              </button>
            </div>
          </div>
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
          message={modal.message}
          onConfirm={modal.action}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
}

export default Favoritos;