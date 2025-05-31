import React, { useEffect, useState } from "react";
import "./Loja.css";
import cares from "../../assets/Cares.png";
import iconFallback from "../../assets/icon.jpg";
import coracaofv from "../../assets/coracaofv.jpg";
import coracaofv2 from "../../assets/coracaofv2.jpg";
import { api } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../components/ToastBar/ToastBar.js";

const HeaderHistorico = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/InfoUtilizador", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
      }
    };

    const verificarAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data);
      } catch (error) {
        console.error("Erro ao verificar admin:", error);
      }
    };

    fetchUserInfo();
    verificarAdmin();
  }, []);

  return (
    <header className="header-historico">
      {isAdmin && (
        <button
          className="historico-button"
          onClick={() => navigate("/HistoricoLojas")}
        >
          <FaHistory className="historico-icon" />
          Histórico de Lojas
        </button>
      )}
    </header>
  );
};

function Loja() {
  const [artigos, setArtigos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [transacaoId, setTransacaoId] = useState(null);
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);
  const [mostrarPopupStock, setMostrarPopupStock] = useState(false);
  const [quantidadeStock, setQuantidadeStock] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtigos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("Artigos/Disponiveis", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArtigos(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar artigos:", error);
        setToast({
          message: error.message || "Erro ao carregar artigos da loja.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("/Favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Favoritos:", response.data);
        setFavoritos(response.data.map((artigo) => artigo.artigoId) || []);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setToast({
          message: "Erro ao carregar favoritos.",
          type: "error",
        });
      }
    };

    const verificarAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data);
      } catch (error) {
        console.error("Erro ao verificar o tipo de utilizador", error);
        setIsAdmin(false);
        setToast({
          message: "Erro ao verificar permissões de administrador.",
          type: "error",
        });
      }
    };

    fetchArtigos();
    fetchFavoritos();
    verificarAdmin();
  }, []);

  const handleFavoritar = async (artigoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      if (favoritos.includes(artigoId)) {
        await api.delete(`/Favoritos/${artigoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritos(favoritos.filter((id) => id !== artigoId));
        setToast({
          message: "Artigo removido dos favoritos.",
          type: "success",
        });
      } else {
        const response = await api.post(`/Favoritos/${artigoId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 204) {
          setFavoritos([...favoritos, artigoId]);
          setToast({
            message: "Artigo adicionado aos favoritos.",
            type: "success",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar artigo:", error);
      let message = "Erro ao favoritar/desfavoritar artigo.";
      if (error.response?.status === 404) {
        message = "Artigo não encontrado.";
      } else if (error.response?.status === 409) {
        message = "Artigo já está nos favoritos.";
        setFavoritos([...favoritos, artigoId]);
      }
      setToast({ message, type: "error" });
    }
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
        "Vendas/Comprar",
        { artigosIds: [artigoSelecionado] },
        {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleNovoArtigo = () => {
    navigate("/publicarartigo");
  };

  const handleEditarStock = (artigoId) => {
    console.log("Botão Repor Stock clicado para artigoId:", artigoId);
    setArtigoSelecionado(artigoId);
    setQuantidadeStock("");
    setMostrarPopupStock(true);
  };

  const confirmarReporStock = async () => {
    console.log("Confirmando reposição de stock para artigoId:", artigoSelecionado);
    if (!quantidadeStock || parseInt(quantidadeStock) <= 0) {
      setToast({
        message: "Por favor, insira uma quantidade válida maior que zero.",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const response = await api.put(
        `Artigos/${artigoSelecionado}/Repor-stock-(admin)`,
        { quantidade: parseInt(quantidadeStock) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setToast({
        message: "Stock reposto com sucesso!",
        type: "success",
      });
      setMostrarPopupStock(false);
      setTimeout(() => {
        setArtigos((prevArtigos) =>
          prevArtigos.map((artigo) =>
            artigo.artigoId === artigoSelecionado
              ? { ...artigo, quantidadeDisponivel: response.data.quantidadeDisponivel }
              : artigo
          )
        );
        setArtigoSelecionado(null);
        setQuantidadeStock("");
      }, 3000);
    } catch (error) {
      console.error("Erro ao repor stock:", error);
      setToast({
        message: error.response?.data || "Erro ao repor stock.",
        type: "error",
      });
      setMostrarPopupStock(false);
    }
  };

  const cancelarReporStock = () => {
    console.log("Reposição de stock cancelada");
    setMostrarPopupStock(false);
    setArtigoSelecionado(null);
    setQuantidadeStock("");
  };

  const enviarComprovativoEmail = async () => {
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }

    try {
      const response = await api.get(`Vendas/Comprovativo/Email/${transacaoId}`);
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
    if (!transacaoId) {
      setToast({ message: "Transação não encontrada.", type: "error" });
      return;
    }

    try {
      const response = await api.get(`Vendas/Comprovativo/Download/${transacaoId}`, {
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

  return (
    <div className="container-loja">
      <h1 className="titulo-principal">Loja de Artigos</h1>

      {isLoading ? (
        <p>A carregar artigos...</p>
      ) : (
        <div className="conteudo-loja">
          {isAdmin && (
            <div className="card-artigo novo-artigo" onClick={handleNovoArtigo}>
              <p className="titulo-novo-artigo">Publicar novo artigo</p>
              <div className="icone-plus">
                <h3>+</h3>
              </div>
            </div>
          )}

          {artigos.map((artigo) => (
            <div key={artigo.artigoId} className="card-artigo">
              <div className="favorito-icon">
                <img
                  src={favoritos.includes(artigo.artigoId) ? coracaofv2 : coracaofv}
                  alt="Favoritar"
                  className="heart-icon"
                  onClick={() => handleFavoritar(artigo.artigoId)}
                />
              </div>
              <h3>{artigo.nomeArtigo}</h3>
              <div className="img-artigo">
                {artigo.fotografiaArt !== "string" && artigo.fotografiaArt ? (
                  <img
                    src={`data:image/jpeg;base64,${artigo.fotografiaArt}`}
                    alt={artigo.nomeArtigo}
                    onError={(e) => (e.target.src = iconFallback)}
                  />
                ) : (
                  <img src={iconFallback} alt="Imagem padrão" />
                )}
              </div>
              <div className="card-artigo-header">
                <div className="custo-artigo">
                  <div className="custo-container">
                    <img src={cares} alt="Cares" className="icon" />
                    <strong>{artigo.custoCares}</strong>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    className="botao-editar"
                    onClick={() => handleEditarStock(artigo.artigoId)}
                  >
                    Repor Stock
                  </button>
                )}
              </div>
              <div className="botoes-artigo">
                <button
                  className="botao-mais-detalhes"
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
          ))}
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

      {mostrarPopupStock && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Repor Stock do Artigo</p>
            <input
              type="number"
              value={quantidadeStock}
              onChange={(e) => setQuantidadeStock(e.target.value)}
              placeholder="Quantidade a adicionar"
              className="input-stock"
              min="1"
            />
            <div className="popup-buttons">
              <button onClick={confirmarReporStock} className="botao-confirmar">
                Confirmar
              </button>
              <button onClick={cancelarReporStock} className="botao-cancelar">
                Cancelar
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
    </div>
  );
}

const LojaPage = () => {
  return (
    <div>
      <HeaderHistorico />
      <HeaderProfileCares />
      <Loja />
    </div>
  );
};

export default LojaPage;