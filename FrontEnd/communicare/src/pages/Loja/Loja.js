import React, { useEffect, useState } from "react";
import "./Loja.css";
import person1 from "../../assets/person1.jpg";
import cares from "../../assets/Cares.png"; 
import { api } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import iconFallback from '../../assets/icon.jpg';
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";

function Loja() {
  const [artigos, setArtigos] = useState([]);
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
    verificarAdmin();
  }, []);

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
      const response = await api.get(`Vendas/Comprovativo/Download/${transacaoId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ComprovativoCompra.pdf');
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
              <h3>{artigo.nomeArtigo}</h3>
              <div className="img-artigo">
                {artigo.fotografiaArt !== "string" && artigo.fotografiaArt ? (
                  <img src={`data:image/jpeg;base64,${artigo.fotografiaArt}`} alt={artigo.nomeArtigo} />
                ) : (
                  <span className="no-img">Sem imagem</span>
                )}
              </div>
              <div className={`custo-artigo ${isAdmin ? '' : 'center'}`}>
                {isAdmin ? (
                  <>
                    <div className="custo-container">
                      <img src={cares} alt="Cares" className="icon" />
                      <strong>{artigo.custoCares}</strong>
                    </div>
                    <button className="botao-editar" onClick={() => handleEditarStock(artigo.artigoId)}>
                      Repor Stock
                    </button>
                  </>
                ) : (
                  <div className="custo-container">
                    <img src={cares} alt="Cares" className="icon" />
                    <strong>{artigo.custoCares}</strong>
                  </div>
                )}
              </div>

              <div className="botoes-artigo">
                <button className="botao-mais-detalhes" onClick={() => handleMaisDetalhes(artigo.artigoId)}>
                  Mais Detalhes
                </button>
                <button className="botao-comprar" onClick={() => handleComprar(artigo.artigoId)}>
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
              <button onClick={confirmarCompra} className="botao-confirmar">Sim</button>
              <button onClick={cancelarCompra} className="botao-cancelar">Não</button>
            </div>
          </div>
        </div>
      )}

      {mostrarEscolhaComprovativo && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Como deseja receber o comprovativo?</p>
            <div className="popup-buttons">
              <button onClick={enviarComprovativoEmail} className="botao-confirmar">Por E-mail</button>
              <button onClick={downloadComprovativoPDF} className="botao-confirmar">Baixar PDF</button>
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
              <button onClick={confirmarReporStock} className="botao-confirmar">Confirmar</button>
              <button onClick={cancelarReporStock} className="botao-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loja;