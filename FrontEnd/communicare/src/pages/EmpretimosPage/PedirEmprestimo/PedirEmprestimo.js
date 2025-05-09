import React, { useState, useEffect } from "react";
import "./PedirEmprestimo.css";
import person1 from '../../../assets/person1.jpg';
import cares from '../../../assets/Cares.png';
import { api } from '../../../utils/axios.js';
import { useNavigate } from 'react-router-dom';

const HeaderProfileCares = () => {
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
        console.log("User info recebida:", response.data);
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
        src={userInfo ? `http://localhost:5000/${userInfo.fotoUtil}` : '../../../../assets/icon.jpg'}
        width={60}
        height={60}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '../../../../assets/icon.jpg'; // Fallback caso a imagem não exista
        }}
      />
    </header>
  );
};

function PedirEmprestimo() {
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [numCares, setNumCares] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utilizadorId, setUtilizadorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Utilizador não autenticado.');
        return;
      }

      try {
        const response = await api.get('/Utilizadores/InfoUtilizador');
        if (response.status === 200) {
          setUtilizadorId(response.data.utilizadorId); // Aqui está a correção para pegar o utilizadorId
        } else {
          alert('Erro ao obter as informações do utilizador.');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do utilizador:', error);
        alert('Erro ao buscar informações do utilizador.');
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
      alert('Preencha todos os campos antes de enviar.');
      return;
    }

    if (!utilizadorId) {
      alert("Informações do utilizador ainda a carregar. Aguarde uns segundos e tente novamente.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Utilizador não autenticado.');
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
        alert(response.data);
        setTitulo("");
        setDetalhes("");
        setNumCares("");
        setImagem(null);
        setImagemBase64("");
        navigate('/MeusEmprestimos');
      } else {
        alert('Erro ao enviar o pedido: ' + response.data.mensagem);
      }
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      alert('Erro ao enviar o pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-Emprestimo">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Pedir Empréstimo</h1>
      <div className="conteudo-Emprestimo">
        <div className="form-lado-esquerdo">
          <div className="perfil-user">
            <img src={person1} className="img-perfil" width={60} height={60} alt="Perfil" />
          </div>

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

        <div className="form-lado-direito">
          <div className="linha-titulo">
            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-titulo-direito" />
            <button className="botao-adicionar" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'A enviar...' : 'Adicionar'}
            </button>
          </div>

          <textarea placeholder="Detalhes" maxLength={255} value={detalhes} onChange={(e) => setDetalhes(e.target.value)} className="textarea-detalhes"></textarea>
          <span className="contador-detalhes">{detalhes.length}/255</span>
        </div>
      </div>
    </div>
  );
}

export default PedirEmprestimo;
