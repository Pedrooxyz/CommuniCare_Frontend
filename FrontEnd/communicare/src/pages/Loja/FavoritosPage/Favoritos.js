import React, { useEffect, useState } from "react";
import "./Favoritos.css";
import cares from "../../../assets/Cares.png";
import { api } from "../../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [transacaoId, setTransacaoId] = useState(null);
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoritos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Favoritos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoritos(response.data);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        alert("Erro ao carregar artigos favoritos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  const handleComprar = (artigoId) => {
    setArtigoSelecionado(artigoId);
    setMostrarPopup(true);
  };

  const confirmarCompra = async () => {
    try {
      const token = localStorage.getItem("token");

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

  const enviarComprovativoEmail = async () => {
    if (!transacaoId) {
      alert("Transação não encontrada.");
      return;
    }

    try {
      const response = await api.get(`/Vendas/Comprovativo/Email/${transacaoId}`);
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
      const response = await api.get(`/Vendas/Comprovativo/Download/${transacaoId}`, {
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
    <div className="container-favoritos">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Meus Favoritos</h1>

      {isLoading ? (
        <p>A carregar favoritos...</p>
      ) : (
        <div className="conteudo-favoritos">
          {favoritos.length === 0 ? (
            <p className="sem-favoritos">Sem artigos favoritos.</p>
          ) : (
            favoritos.map((artigo) => (
              <div key={artigo.artigoId} className="card-artigo">
                <h3>{artigo.nomeArtigo}</h3>
                <div className="img-artigo">
                  {artigo.fotografiaArt && artigo.fotografiaArt !== "string" ? (
                    <img src={`data:image/jpeg;base64,${artigo.fotografiaArt}`} alt={artigo.nomeArtigo} />
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
    </div>
  );
}

export default Favoritos;
