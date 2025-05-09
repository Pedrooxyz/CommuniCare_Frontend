import React, { useState } from "react";
import "./PedirVoluntariado.css";
import person1 from '../../../assets/person1.jpg';
import cares from '../../../assets/Cares.png';
import { api } from '../../../utils/axios.js';

import { useNavigate } from 'react-router-dom'; // Para navegação após sucesso

const HeaderProfileCares = () => {
  return (
    <header className="header-vol">
      <p>100</p>
      <img className="imgHeaderVol" src={cares} width={45} height={45} alt="Cares" />
      <img className="imgHeaderVol profile-pic" src={person1} width={60} height={60} alt="Person" />
    </header>
  );
};

function PedirVoluntariado() {
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [data, setData] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [duracao, setDuracao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para mostrar carregando
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

  const handleSelecionarNumeroHoras = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value);
    if (value === '' || (intValue >= 1 && intValue <= 24)) {
      setDuracao(value);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !detalhes || !data || !numPessoas || !duracao) {
      alert('Preencha todos os campos antes de enviar.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Utilizador não autenticado.');
      return;
    }

    const pedidoData = {
      DescPedido: detalhes,
      HorarioAjuda: data,
      NHoras: parseInt(duracao),
      NPessoas: parseInt(numPessoas),
      FotografiaPA: imagemBase64
    };

    try {
      setIsSubmitting(true); 
      const response = await api.post('PedidosAjuda/Pedir', pedidoData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        alert(response.data.mensagem);
        setTitulo("");
        setDetalhes("");
        setData("");
        setNumPessoas("");
        setDuracao("");
        setImagem(null);
        setImagemBase64("");

        // Navegar para outra página (por exemplo, para o perfil)
        navigate('/MeusPedidos');
      } else {
        alert('Erro ao enviar o pedido: ' + response.data.mensagem);
      }
      
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      alert('Erro ao enviar o pedido.');
    } finally {
      setIsSubmitting(false); // Definir estado para 'não carregando' após a tentativa
    }
    
  };

  return (
    <div className="container-voluntariado">
      <HeaderProfileCares />
      <h1 className="titulo-principal">Pedir Voluntariado</h1>
      <div className="conteudo-voluntariado">
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
            <span>⏰
              <input type="number" placeholder="Número Horas" min={1} max={24} value={duracao} onChange={handleSelecionarNumeroHoras} />
            </span>
          </div>

          <div className="icones-info">
            <span>📅
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </span>
          </div>
        </div>

        <div className="form-lado-direito">
          <div className="linha-titulo">
            <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-titulo-direito" />
            <button className="botao-pedir" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'A enviar...' : 'Pedir'}
            </button>
          </div>

          <textarea placeholder="Detalhes" maxLength={255} value={detalhes} onChange={(e) => setDetalhes(e.target.value)} className="textarea-detalhes"></textarea>
          <span className="contador-detalhes">{detalhes.length}/255</span>
        </div>
      </div>
    </div>
  );
}

export default PedirVoluntariado;
