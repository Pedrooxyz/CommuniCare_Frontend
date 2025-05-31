import React, { useState, useEffect } from "react";
import "./PublicarArtigo.css";
import cares from "../../assets/Cares.png";
import { api } from "../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import iconFallback from '../../assets/icon.jpg';
import HeaderProfileCares from "../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../components/ToastBar/ToastBar.js";

function PublicarArtigo() {
  const [userInfo, setUserInfo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [custoCares, setCustoCares] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        console.log("Informações do utilizador carregadas:", response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
        setToast({
          message: error.message || "Erro ao carregar informações do utilizador.",
          type: "error",
        });
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
        console.log("Imagem selecionada, base64 gerado com tamanho:", reader.result.length);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    console.log("Tentando publicar artigo:", { titulo, conteudo, custoCares, quantidade, imagemBase64: imagemBase64 ? "presente" : "ausente" });

    if (!titulo || !conteudo || !custoCares || !quantidade) {
      setToast({
        message: "Preencha todos os campos obrigatórios.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        message: "Utilizador não autenticado.",
        type: "error",
      });
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
        setToast({
          message: "Artigo publicado com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          setTitulo("");
          setConteudo("");
          setImagem(null);
          setImagemBase64("");
          setCustoCares("");
          setQuantidade("");
          navigate("/loja");
        }, 3000);
      } else {
        setToast({
          message: response.data.mensagem || "Erro ao publicar artigo.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao publicar artigo:", error);
      setToast({
        message: error.response?.data?.mensagem || "Erro ao publicar artigo.",
        type: "error",
      });
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

export default PublicarArtigo;