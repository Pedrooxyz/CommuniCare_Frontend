import React, { useState } from "react";
import "./PedirEmprestimo.css";
import person1 from '../../../assets/person1.jpg';
import cares from '../../../assets/Cares.png';
import { api } from '../../../utils/axios.js';

import { useNavigate } from 'react-router-dom'; 

const HeaderProfileCares = () => {
  return (
    <header className="header-vol">
      <p>100</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderVol profile-pic" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

function PedirEmprestimo() {
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [data, setData] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [numCares, setNumCares] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

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

  const handleSelecionarNumeroPessoas = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value);
    if (value === '' || (intValue >= 1 && intValue <= 99)) {
      setNumPessoas(value);
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
    if (!titulo || !detalhes || !numPessoas || !numCares ) {
      alert('Preencha todos os campos antes de enviar.');
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
      idEmprestador: 0, // Aqui podes colocar o ID do utilizador autenticado, se o tiveres
    };
  
    try {
      setIsSubmitting(true);
      const response = await api.post('ItensEmprestimo/AdicionarItem', pedidoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        alert(response.data);
        setTitulo("");
        setDetalhes("");
        setData("");
        setNumPessoas("");
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
            <span>👥
              <input type="text" placeholder="Número Pessoas" maxLength={2} value={numPessoas} onChange={handleSelecionarNumeroPessoas} />
            </span>
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

          <textarea placeholder="Detalhes" maxLength={300} value={detalhes} onChange={(e) => setDetalhes(e.target.value)} className="textarea-detalhes"></textarea>
          <span className="contador-detalhes">{detalhes.length}/300</span>
        </div>
      </div>
    </div>
  );
}

export default PedirEmprestimo;
