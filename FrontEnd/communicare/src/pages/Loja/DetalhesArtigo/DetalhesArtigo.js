import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./DetalhesArtigo.css";
import person1 from "../../../assets/person1.jpg";
import cares from "../../../assets/Cares.png";

const HeaderProfileCares = () => {
  const navigate = useNavigate();
  
  return (
    <header className="detalhes-header-vol">
      <div className="detalhes-header-right">
        <p className="detalhes-ptext">1000</p>
        <img className="detalhes-imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
        <img className="detalhes-imgHeaderVol" src={person1} width={60} height={60} alt="Person" />
      </div>
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
        console.log("Token:", token);
        if (!token) {
          alert("Você precisa estar autenticado para acessar os detalhes do artigo.");
          navigate("/login");
          return;
        }

        const response = await api.get(`Artigos/${artigoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArtigo(response.data);
      } catch (error) {
        console.error("Erro ao carregar detalhes do artigo:", error);
        alert("Erro ao carregar detalhes do artigo. Verifique se o artigo existe.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtigo();
  }, [artigoId, navigate]);

  const handleComprar = () => {
    alert(`Comprar artigo ID: ${artigoId}`);
  };

  if (isLoading) {
    return <p className="detalhes-loading">A carregar detalhes...</p>;
  }

  if (!artigo) {
    return <p className="detalhes-error">Artigo não encontrado.</p>;
  }

  return (
    <div className="detalhes-container">
      <HeaderProfileCares />
      <h1 className="detalhes-titulo-principal">Detalhes do Artigo</h1>
      <div className="detalhes-card">
        <h3 className="detalhes-titulo-artigo">{artigo.nomeArtigo}</h3>
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