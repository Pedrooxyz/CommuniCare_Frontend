import React, { useState, useEffect } from "react";
import "./PedirVoluntariado.css";
import ToastBar from '../../../components/ToastBar/ToastBar.js';
import { api } from "../../../utils/axios.js";
import { useNavigate } from "react-router-dom";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";

function PedirVoluntariado() {
  const [userInfo, setUserInfo] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemBase64, setImagemBase64] = useState("");
  const [data, setData] = useState("");
  const [numPessoas, setNumPessoas] = useState("");
  const [duracao, setDuracao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/Utilizadores/InfoUtilizador", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar info do utilizador:", error);
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
        setImagemBase64(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelecionarNumeroPessoas = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value);
    if (value === "" || (intValue >= 1 && intValue <= 99)) {
      setNumPessoas(value);
    }
  };

  const handleSelecionarNumeroHoras = (e) => {
    const value = e.target.value;
    const intValue = parseInt(value);
    if (value === "" || (intValue >= 1 && intValue <= 24)) {
      setDuracao(value);
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !detalhes || !data || !numPessoas || !duracao) {
      setToast({ message: "Preencha todos os campos antes de enviar.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ message: "Utilizador não autenticado.", type: "error" });
      return;
    }

    const pedidoData = {
      Titulo: titulo, 
      DescPedido: detalhes,
      HorarioAjuda: data,
      NHoras: parseInt(duracao),
      NPessoas: parseInt(numPessoas),
      FotografiaPA: imagemBase64,
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("PedidosAjuda/Pedir", pedidoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setToast({ message: response.data.mensagem, type: "success" });
        setTitulo("");
        setDetalhes("");
        setData("");
        setNumPessoas("");
        setDuracao("");
        setImagem(null);
        setImagemBase64("");
        setTimeout(() => navigate("/MeusPedidos"), 3000);
      } else {
        setToast({ message: "Erro ao enviar o pedido: " + response.data.mensagem, type: "error" });
      }
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      setToast({ message: "Erro ao enviar o pedido.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-voluntariado">
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <HeaderProfileCares userInfo={userInfo} />
      <h1 className="titulo-principal1">Pedir Ajuda</h1>
      <div className="conteudo-voluntariado">
        <div className="form-lado-esquerdo">

          <div className="upload-imagem">
            <label className="upload-label">
              {imagem ? (
                <img src={imagem} alt="Upload preview" className="preview-img" />
              ) : (
                <span className="plus-sign">+</span>
              )}
              <input type="file" accept="image/*" onChange={handleImagemChange} hidden />
            </label>
          </div>

          <div className="icones-info">
            <span>
              👥
              <input
                type="text"
                placeholder="Número Pessoas"
                maxLength={2}
                value={numPessoas}
                onChange={handleSelecionarNumeroPessoas}
              />
            </span>
          </div>

          <div className="icones-info">
            <span>
              ⏰
              <input
                type="number"
                placeholder="Número Horas"
                min={1}
                max={24}
                value={duracao}
                onChange={handleSelecionarNumeroHoras}
              />
            </span>
          </div>

          <div className="icones-info">
            <span>
              📅
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </span>
          </div>
        </div>

        <div className="form-lado-direito">
          <div className="linha-titulo">
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-titulo-direito"
            />
            <button className="botao-pedir" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "A enviar..." : "Pedir"}
            </button>
          </div>

          <textarea
            placeholder="Detalhes"
            maxLength={255}
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            className="textarea-detalhes1"
          ></textarea>
          <span className="contador-detalhes1">{detalhes.length}/255</span>
        </div>
      </div>
    </div>
  );
}

export default PedirVoluntariado;
