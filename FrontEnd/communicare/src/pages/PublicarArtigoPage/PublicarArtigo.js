import React, { useState, useEffect } from "react";
import "./PublicarArtigo.css";
import person1 from "../../assets/person1.jpg";
import cares from "../../assets/Cares.png";
import { api } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import iconFallback from '../../assets/icon.jpg';
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";

/*
const HeaderProfileCaresComponent = () => {
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
*/

function PublicarArtigo() {
  const [userInfo, setUserInfo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [custoCares, setCustoCares] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleImagemChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result);
        setImagemBase64(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !conteudo || !custoCares || !quantidade) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Utilizador não autenticado.");
      return;
    }

    const artigoData = {
      nomeArtigo: titulo,
      descArtigo: conteudo,
      custoCares: parseInt(custoCares, 10),
      quantidadeDisponivel: parseInt(quantidade, 10),
      fotografiaArt: imagemBase64
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("Artigos/Publicar-(admin)", artigoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Artigo publicado com sucesso!");
        setTitulo("");
        setConteudo("");
        setImagem(null);
        setImagemBase64("");
        setCustoCares("");
        setQuantidade("");
        navigate("/loja");
      } else {
        alert("Erro: " + response.data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao publicar artigo:", error);
      alert("Erro ao publicar artigo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-artigo">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Publicar Artigo</h1>
      <div className="conteudo-artigo">
        <div className="form-lado-esquerdo">

          <label className="upload-label">
            {imagem ? (
              <img src={imagem} alt="Preview" className="preview-img" />
            ) : (
              <span className="plus-sign">+</span>
            )}
            <input type="file" accept="image/*" onChange={handleImagemChange} hidden />
          </label>

          <div className="icones-info">
            <span>
              <img src={cares} alt="Cares" width={25} height={25} />
              <input
                type="number"
                placeholder="Custo (cares)"
                value={custoCares}
                onChange={(e) => setCustoCares(e.target.value)}
              />
            </span>
            <span>
              📦
              <input
                type="number"
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </span>
          </div>
        </div>

        <div className="form-lado-direito">
          <div className="linha-titulo">
            <input
              type="text"
              placeholder="Título do artigo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-titulo-direito"
            />
            <button className="botao-publicar" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "A publicar..." : "Publicar"}
            </button>
          </div>

          <textarea
            placeholder="Descrição do artigo"
            maxLength={1500}
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="textarea-detalhes"
          ></textarea>
          <span className="contador-detalhes">{conteudo.length}/1500</span>
        </div>
      </div>
    </div>
  );
}

export default PublicarArtigo;
