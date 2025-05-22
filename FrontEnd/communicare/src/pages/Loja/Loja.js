import React, { useEffect, useState } from "react";
import "./Loja.css";
import cares from "../../assets/Cares.png";
import iconFallback from "../../assets/icon.jpg";
import coracaofv from "../../assets/coracaofv.jpg"; // Coração não favoritado
import coracaofv2 from "../../assets/coracaofv2.jpg"; // Coração favoritado
import { api } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";

function Loja() {
  const [artigos, setArtigos] = useState([]);
  const [favoritos, setFavoritos] = useState([]); // Estado para rastrear favoritos
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [transacaoId, setTransacaoId] = useState(null);
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);
  const [mostrarPopupStock, setMostrarPopupStock] = useState(false);
  const [quantidadeStock, setQuantidadeStock] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtigos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("Artigos/Disponiveis", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtigos(response.data);
      } catch (error) {
        console.error("Erro ao carregar artigos:", error);
        alert("Erro ao carregar artigos da loja.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Favoritos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assumindo que o endpoint /Favoritos retorna objetos com artigoId
        console.log("Favoritos:", response.data); // Log para debugging
        setFavoritos(response.data.map((artigo) => artigo.artigoId));
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        alert("Erro ao carregar favoritos.");
      }
    };

    const verificarAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/VerificarAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAdmin(response.data);
      } catch (error) {
        console.error("Erro ao verificar o tipo de utilizador", error);
        setIsAdmin(false);
      }
    };

    fetchArtigos();
    fetchFavoritos();
    verificarAdmin();
  }, []);

  const handleFavoritar = async (artigoId) => {
    try {
      const token = localStorage.getItem("token");
      if (favoritos.includes(artigoId)) {
        // Remover dos favoritos
        await api.delete(`/Favoritos/${artigoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoritos(favoritos.filter((id) => id !== artigoId));
        alert("Artigo removido dos favoritos.");
      } else {
        // Adicionar aos favoritos
        const response = await api.post(`/Favoritos/${artigoId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 204) {
          setFavoritos([...favoritos, artigoId]);
          alert("Artigo adicionado aos favoritos.");
        }
      }
    } catch (error) {
      console.error("Erro ao favoritar/desfavoritar artigo:", error);
      if (error.response?.status === 404) {
        alert("Artigo não encontrado.");
      } else if (error.response?.status === 409) {
        alert("Artigo já está nos favoritos.");
        setFavoritos([...favoritos, artigoId]); // Garante que o estado reflete o favorito
      } else {
        alert("Erro ao favoritar/desfavoritar artigo.");
      }
    }
  };

  const handleComprar = (artigoId) => {
    setArtigoSelecionado(artigoId);
    setMostrarPopup(true);
  };

  const confirmarCompra = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "Vendas/Comprar",
        { artigosIds: [artigoSelecionado] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.sucesso) {
        alert("Compra realizada com sucesso!");
        const transacaoId = response.data.transacaoId;
        setTransacaoId(transacaoId);
        setMostrarPopup(false);
        setMostrarEscolhaComprovativo(true);
      } else {
        alert("Erro na compra: " + response.data.erro);
      }
    } catch (error) {
      console.error("Erro ao realizar a compra:", error);
      alert("Erro ao realizar a compra.");
      setMostrarPopup(false);
    }
  };

  const cancelarCompra = () => {
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
    setArtigoSelecionado(artigoId);
    setQuantidadeStock("");
    setMostrarPopupStock(true);
  };

  const confirmarReporStock = async () => {
    if (!quantidadeStock || parseInt(quantidadeStock) <= 0) {
      alert("Por favor, insira uma quantidade válida maior que zero.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `Artigos/${artigoSelecionado}/Repor-stock-(admin)`,
        { quantidade: parseInt(quantidadeStock) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Stock reposto com sucesso!");
      setArtigos((prevArtigos) =>
        prevArtigos.map((artigo) =>
          artigo.artigoId === artigoSelecionado
            ? { ...artigo, quantidadeDisponivel: response.data.quantidadeDisponivel }
            : artigo
        )
      );
      setMostrarPopupStock(false);
      setArtigoSelecionado(null);
      setQuantidadeStock("");
    } catch (error) {
      console.error("Erro ao repor stock:", error);
      alert("Erro ao repor stock: " + (error.response?.data || "Erro desconhecido"));
      setMostrarPopupStock(false);
    }
  };

  const cancelarReporStock = () => {
    setMostrarPopupStock(false);
    setArtigoSelecionado(null);
    setQuantidadeStock("");
  };

  const enviarComprovativoEmail = async () => {
    if (!transacaoId) {
      alert("Transação não encontrada.");
      return;
    }

    try {
      const response = await api.get(`Vendas/Comprovativo/Email/${transacaoId}`);
      if (response.data.mensagem) {
        alert(response.data.mensagem);
      } else {
        alert("Erro ao enviar comprovativo por email.");
      }
    } catch (error) {
      alert("Erro ao enviar comprovativo por email.");
    }
    setMostrarEscolhaComprovativo(false);
  };

  const downloadComprovativoPDF = async () => {
    if (!transacaoId) {
      alert("Transação não encontrada.");
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
    } catch (error) {
      alert("Erro ao baixar comprovativo em PDF.");
    }
    setMostrarEscolhaComprovativo(false);
  };

  return (
    <div className="container-loja">
      <HeaderProfileCares />
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
    </div>
  );
}

export default Loja;