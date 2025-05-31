import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetalhesArtigo.css";
import cares from "../../../assets/Cares.png";
import { api } from "../../../utils/axios.js";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../components/ToastBar/ToastBar.js";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.js";

const DetalhesItem = () => {
  const { artigoId } = useParams();

  const [item, setItem] = useState({
    nomeArtigo: "",
    descArtigo: "",
    custoCares: 0,
    fotografiaArt: "",
  });

  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mostrarErroPopup, setMostrarErroPopup] = useState(false);
  const [transacaoId, setTransacaoId] = useState(null);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", action: null });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const resp = await api.get(`/Artigos/${artigoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = resp.data;
        setItem({
          nomeArtigo: data.nomeArtigo ?? "",
          descArtigo: data.descArtigo ?? "",
          custoCares: data.custoCares ?? 0,
          fotografiaArt:
            data.fotografiaArt && data.fotografiaArt !== "string"
              ? `data:image/jpeg;base64,${data.fotografiaArt}`
              : "",
        });
      } catch (err) {
        console.error("Erro ao buscar detalhes do item:", err);
        setToast({
          message: err.message || "Erro ao carregar os detalhes do item.",
          type: "error",
        });
      }
    };
    fetchItem();
  }, [artigoId]);

  const handleComprar = () => {
    console.log("Botão Comprar clicado para artigoId:", artigoId);
    setModal({
      isOpen: true,
      message: "Tem a certeza de que deseja comprar este artigo?",
      action: confirmarCompra,
    });
    console.log("Estado modal atualizado para compra:", {
      isOpen: true,
      message: "Tem a certeza de que deseja comprar este artigo?",
    });
  };

  const confirmarCompra = async () => {
    console.log("Confirmando compra para artigoId:", artigoId);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const resp = await api.post(
        "Vendas/Comprar",
        { artigosIds: [artigoId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.data.sucesso) {
        setToast({
          message: "Compra realizada com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          setTransacaoId(resp.data.transacaoId);
          setModal({ isOpen: false, message: "", action: null });
          setMostrarEscolhaComprovativo(true);
        }, 3000);
      } else {
        setMensagemErro(resp.data.erro || "Erro na compra.");
        setModal({ isOpen: false, message: "", action: null });
        setMostrarErroPopup(true);
      }
    } catch (err) {
      console.error("Erro ao realizar a compra:", err);
      const erroBackend = err.response?.data?.erro || "Erro ao realizar a compra.";
      setMensagemErro(erroBackend);
      setModal({ isOpen: false, message: "", action: null });
      setMostrarErroPopup(true);
    }
  };

  const cancelarCompra = () => {
    console.log("Compra cancelada");
    setModal({ isOpen: false, message: "", action: null });
  };

  const enviarComprovativoEmail = async () => {
    console.log("Enviando comprovativo por email para transacaoId:", transacaoId);
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const r = await api.get(`Vendas/Comprovativo/Email/${transacaoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        message: r.data.mensagem || "Comprovativo enviado por email com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        setMostrarEscolhaComprovativo(false);
      }, 3000);
    } catch (err) {
      console.error("Erro ao enviar comprovativo por email:", err);
      setToast({
        message: "Erro ao enviar comprovativo por email.",
        type: "error",
      });
      setMostrarEscolhaComprovativo(false);
    }
  };

  const downloadComprovativoPDF = async () => {
    console.log("Baixando comprovativo PDF para transacaoId:", transacaoId);
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const r = await api.get(`Vendas/Comprovativo/Download/${transacaoId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ComprovativoCompra.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({
        message: "Comprovativo baixado com sucesso!",
        type: "success",
      });
        setMostrarEscolhaComprovativo(false);
    } catch (err) {
      console.error("Erro ao baixar comprovativo em PDF:", err);
      setToast({
        message: "Erro ao baixar comprovativo em PDF.",
        type: "error",
      });
      setMostrarEscolhaComprovativo(false);
    }
  };

  return (
    <div className="detalhesContainer">
      <div className="colunaEsquerda">
        <h2 className="tituloItem">{item.nomeArtigo}</h2>
        {item.fotografiaArt ? (
          <img
            className="imgItemDetalhes"
            src={item.fotografiaArt}
            alt={item.nomeArtigo}
          />
        ) : (
          <span className="no-img">Sem imagem</span>
        )}
        <div className="infoItem detalhes">
          <span>
            <img src={cares} width={30} height={30} alt="Cares" /> {item.custoCares}
          </span>
        </div>
        <button className="botaoComprar" onClick={handleComprar}>
          Comprar
        </button>
      </div>

      <div className="colunaDireita">
        <h2 className="tituloItem">Detalhes do Artigo</h2>
        <div className="caixaDescricao">{item.descArtigo}</div>
      </div>

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

      {mostrarErroPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{mensagemErro}</p>
            <div className="popup-buttons">
              <button
                onClick={() => setMostrarErroPopup(false)}
                className="botao-confirmar"
              >
                Fechar
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
          onCancel={cancelarCompra}
        />
      )}
    </div>
  );
};

export default function DetalhesArtigo() {
  return (
    <>
      <HeaderProfileCares />
      <DetalhesItem />
    </>
  );
}