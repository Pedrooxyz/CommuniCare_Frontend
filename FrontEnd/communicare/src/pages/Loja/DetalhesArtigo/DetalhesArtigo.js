import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./DetalhesArtigo.css";
import person1 from "../../../assets/person1.jpg";
import cares from "../../../assets/Cares.png";

const HeaderProfileCares = () => {
  return (
    <header className="detalhes-header-vol">
      <p className="detalhes-ptext">1000</p>
      <img className="detalhes-imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="detalhes-imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

const DetalhesArtigo = () => {
  const { artigoId } = useParams();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArtigo = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`Artigos/Disponiveis/${artigoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtigo(response.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do artigo:", error);
        alert("Erro ao carregar detalhes do artigo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtigo();
  }, [artigoId]);

  const handleComprar = () => {
    alert(`Comprar artigo ID: ${artigoId}`);
    // Aqui pode-se redirecionar ou chamar outra API de compra
  };

  if (isLoading) {
    return <p>A carregar detalhes...</p>;
  }

  if (!artigo) {
    return <p>Artigo não encontrado.</p>;
  }

  return (
    <div className="detalhes-container">
      <HeaderProfileCares />
      <h1 className="detalhes-titulo-principal">Detalhes do Artigo</h1>
      <div className="detalhes-card">
        <h3>{artigo.nomeArtigo}</h3>
        <div className="detalhes-img-artigo">
          {artigo.fotografiaArt && artigo.fotografiaArt !== "string" ? (
            <img src={`data:image/jpeg;base64,${artigo.fotografiaArt}`} alt={artigo.nomeArtigo} />
          ) : (
            <span className="detalhes-no-img">Sem imagem</span>
          )}
        </div>
        <p className="detalhes-descricao-artigo">{artigo.descArtigo}</p>
        <div className="detalhes-custo-artigo">
          <img src={cares} alt="Cares" className="detalhes-icon" />
          <strong>{artigo.custoCares}</strong>
        </div>
        <button className="detalhes-botao-comprar" onClick={handleComprar}>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default DetalhesArtigo;