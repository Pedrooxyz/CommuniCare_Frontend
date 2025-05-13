import React, { useEffect, useState } from "react";
import "./Loja.css";
import person1 from "../../assets/person1.jpg";
import cares from "../../assets/Cares.png"; 
import { api } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import iconFallback from '../../assets/icon.jpg';

const HeaderProfileCares = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header>
      <p style={{ textAlign: "center" }}>
        {userInfo ? userInfo.numCares : "..."}
      </p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img
        className="imgHeaderVol"
        onClick={() => navigate(`/profile`)}
        src={
          userInfo && userInfo.fotoUtil
            ? `http://localhost:5182/${userInfo.fotoUtil}`
            : iconFallback
        }
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = iconFallback;
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          margin: "5px",
          cursor: "pointer",
          borderRadius: "50%",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          boxShadow: isHovered ? "0 0 10px rgba(0,0,0,0.3)" : "none",
        }}
      />
    </header>
  );
};

function Loja() {
  const [artigos, setArtigos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [transacaoId, setTransacaoId] = useState(null); 
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false); 

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
              <div className="custo-artigo">
                <img src={cares} alt="Cares" className="icon" />
                <strong>{artigo.custoCares}</strong>
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
    </div>
  );
}

export default Loja;
