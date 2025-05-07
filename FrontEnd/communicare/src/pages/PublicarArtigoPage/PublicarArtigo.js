import React, { useState } from "react";
import "./PublicarArtigo.css";
import person1 from "../../assets/person1.jpg";
import cares from "../../assets/Cares.png";
import { api } from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const HeaderProfileCares = () => {
  return (
    <header className="header-artigo">
      <p>100</p>
      <img className="imgHeaderArtigo" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderArtigo profile-pic" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

function PublicarArtigo() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [custoCares, setCustoCares] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
          <div className="perfil-user">
            <img src={person1} className="img-perfil" width={60} height={60} alt="Perfil" />
          </div>

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
