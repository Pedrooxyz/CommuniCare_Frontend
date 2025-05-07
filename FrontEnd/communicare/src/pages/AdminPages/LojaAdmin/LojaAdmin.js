import React, { useEffect, useState } from "react";
import "./LojaAdmin.css";
import person1 from "../../../assets/person1.jpg";
import cares from "../../../assets/Cares.png"; // Ícone de Cares
import { api } from "../../../utils/axios.js";
import { useNavigate } from "react-router-dom";

const HeaderProfileCares = () => {
  return (
    <header className="header-vol">
      <p className="ptext">100</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

function Loja() {
  const [artigos, setArtigos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

    fetchArtigos();
  }, []);

  const handleComprar = (artigoId) => {
    alert(`Comprar artigo ID: ${artigoId}`);
    // Aqui poderás redirecionar ou chamar outra API de compra se quiseres
  };

  const handleMaisDetalhes = (artigoId) => {
    navigate(`/detalhesArtigo/${artigoId}`);
  };

  // Função para redirecionar para a página de publicação de artigo
  const handleNovoArtigo = () => {
    navigate("/publicarartigo");
  };

  return (
    <div className="container-loja">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Loja de Artigos</h1>

      {isLoading ? (
        <p>A carregar artigos...</p>
      ) : (
        <div className="conteudo-loja">
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

          {/* Card para publicar novo artigo */}
          <div className="card-artigo novo-artigo" onClick={handleNovoArtigo}>
            <p className="titulo-novo-artigo">Publicar novo artigo</p>
            <div className="icone-plus">
              <h3>+</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loja;