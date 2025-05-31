import React, { useState, useEffect } from "react";
import "./PedirEmprestimo.css";
import cares from '../../../assets/Cares.png';
import iconFallback from '../../../assets/icon.jpg';
import { api } from "../../../utils/axios.js";
import { useNavigate } from 'react-router-dom';
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../components/ToastBar/ToastBar.js";

function PedirEmprestimo() {
  const [userInfo, setUserInfo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [numCares, setNumCares] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utilizadorId, setUtilizadorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({
          message: "Utilizador não autenticado.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/Utilizadores/InfoUtilizador', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserInfo(response.data);
          setUtilizadorId(response.data.utilizadorId);
        } else {
          setToast({
            message: "Erro ao obter as informações do utilizador.",
            type: "error",
          });
        }
      } catch (error) {
        setToast({
          message: error.response?.data?.mensagem || "Erro ao buscar informações do utilizador.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImagemChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result);
        setImagemBase64(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelecionarNumeroCares = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value);
    if (value === '' || (intValue >= 1 && intValue <= 10000)) {
      setNumCares(value);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !detalhes || !numCares) {
      setToast({
        message: "Preencha todos os campos antes de enviar.",
        type: "error",
      });
      return;
    }

    if (!utilizadorId) {
      setToast({
        message: "Informações do utilizador ainda a carregar. Aguarde uns segundos e tente novamente.",
        type: "error",
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setToast({
        message: "Utilizador não autenticado.",
        type: "error",
      });
      return;
    }

    const pedidoData = {
      nomeItem: titulo,
      descItem: detalhes,
      disponivel: 1,
      fotografiaItem: imagemBase64,
      comissaoCares: parseInt(numCares),
      idEmprestador: utilizadorId,
    };

    try {
      setIsSubmitting(true);
      const response = await api.post('ItensEmprestimo/AdicionarItem', pedidoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setToast({
          message: response.data || "Item adicionado com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          setTitulo("");
          setDetalhes("");
          setNumCares("");
          setImagem(null);
          setImagemBase64("");
          navigate('/MeusEmprestimos');
        }, 3000);
      } else {
        setToast({
          message: response.data.mensagem || "Erro ao enviar o pedido.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.mensagem || "Erro ao enviar o pedido.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-Emprestimo">
      <HeaderProfileCares userInfo={userInfo} />
      <h1 className="titulo-principal1">Adicionar Item</h1>
      <div className="conteudo-Emprestimo">
        <div className="form-lado-esquerdo1">
          <div className="perfil-user"></div>

          <div className="upload-imagem">
            <label className="upload-label">
              {imagem ? <img src={imagem} alt="Upload preview" className="preview-img" /> : <span className="plus-sign">+</span>}
              <input type="file" accept="image/*" onChange={handleImagemChange} hidden />
            </label>
          </div>

          <div className="icones-info">
            <span>
              <img src={cares} alt="Cares Icon" style={{ width: '24px', height: '24px' }} />
              <input type="text" placeholder="Número Cares Hora" maxLength={4} value={numCares} onChange={handleSelecionarNumeroCares} />
            </span>
          </div>
        </div>

        <div className="form-lado-direito1">
          <div className="linha-titulo">
            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-titulo-direito" />
            <button className="botao-adicionar" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'A enviar...' : 'Adicionar'}
            </button>
          </div>

          <textarea placeholder="Detalhes" maxLength={255} value={detalhes} onChange={(e) => setDetalhes(e.target.value)} className="textarea-detalhes"></textarea>
          <span className="contador-detalhes2">{detalhes.length}/255</span>
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

export default PedirEmprestimo;