import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./DetalhesArtigo.css";
import cares from "../../../assets/Cares.png";
import { api } from "../../../utils/axios.js";


const HeaderProfileCares = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/Utilizadores/InfoUtilizador");
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
        src={
          userInfo
            ? `http://localhost:5000/${userInfo.fotoUtil}`
            : "../../../../assets/icon.jpg"
        }
        width={60}
        height={60}
        alt="User"
      />
    </header>
  );
};


const DetalhesItem = () => {
  const { artigoId } = useParams();


  const [item, setItem] = useState({
    nomeArtigo: "",
    descArtigo: "",
    custoCares: 0,
    fotografiaArt: "",
  });

  
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarEscolhaComprovativo, setMostrarEscolhaComprovativo] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");        // texto vindo do back-end
  const [mostrarErroPopup, setMostrarErroPopup] = useState(false);
  const [transacaoId, setTransacaoId] = useState(null);

  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const resp = await api.get(`/Artigos/${artigoId}`);
        const data = resp.data;
        setItem({
          nomeArtigo: data.nomeArtigo ?? "",
          descArtigo: data.descArtigo ?? "",
          custoCares: data.custoCares ?? 0,
          fotografiaArt:
            data.fotografiaArt && data.fotografiaArt !== "string"
              ? `data:image/jpeg;base64,${data.fotografiaArt}`
              : "",
        });
      } catch (err) {
        console.error("Erro ao buscar detalhes do item:", err);
        alert("Erro ao carregar os detalhes do item.");
      }
    };
    fetchItem();
  }, [artigoId]);

  
  const handleComprar = () => setMostrarPopup(true);
  const cancelarCompra = () => setMostrarPopup(false);

  const confirmarCompra = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await api.post(
        "Vendas/Comprar",
        { artigosIds: [artigoId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.data.sucesso) {
        setTransacaoId(resp.data.transacaoId);
        setMostrarPopup(false);
        setMostrarEscolhaComprovativo(true);
      } else {
        
        setMensagemErro(resp.data.erro || "Erro na compra.");
        setMostrarPopup(false);
        setMostrarErroPopup(true);
      }
    } catch (err) {
      
      const erroBackend = err.response?.data?.erro || "Erro ao realizar a compra.";
      setMensagemErro(erroBackend);
      setMostrarPopup(false);
      setMostrarErroPopup(true);
    }
  };

  const enviarComprovativoEmail = async () => {
    if (!transacaoId) return alert("Transação não encontrada.");
    try {
      const r = await api.get(`Vendas/Comprovativo/Email/${transacaoId}`);
      alert(r.data.mensagem ?? "Comprovativo enviado!");
    } catch {
      alert("Erro ao enviar comprovativo por email.");
    }
    setMostrarEscolhaComprovativo(false);
  };

  const downloadComprovativoPDF = async () => {
    if (!transacaoId) return alert("Transação não encontrada.");
    try {
      const r = await api.get(
        `Vendas/Comprovativo/Download/${transacaoId}`,
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ComprovativoCompra.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Erro ao baixar comprovativo em PDF.");
    }
    setMostrarEscolhaComprovativo(false);
  };


  return (
    <div className="detalhesContainer">
      
      <div className="colunaEsquerda">
        <h2 className="tituloItem">{item.nomeArtigo}</h2>
        {item.fotografiaArt ? (
          <img
            className="imgItemDetalhes"
            src={item.fotografiaArt}
            alt={item.nomeArtigo}
          />
        ) : (
          <span className="no-img">Sem imagem</span>
        )}
        <div className="infoItem detalhes">
          <span>
            <img src={cares} width={30} height={30} alt="Cares" /> {item.custoCares}
          </span>
        </div>
        <button className="botaoComprar" onClick={handleComprar}>
          Comprar
        </button>
      </div>

     
      <div className="colunaDireita">
        <h2 className="tituloItem">Detalhes do Artigo</h2>
        <div className="caixaDescricao">{item.descArtigo}</div>
      </div>

     
      {mostrarPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Tem a certeza de que deseja comprar este artigo?</p>
            <div className="popup-buttons">
              <button onClick={confirmarCompra} className="botao-confirmar">
                Sim
              </button>
              <button onClick={cancelarCompra} className="botao-cancelar">
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarEscolhaComprovativo && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Como deseja receber o comprovativo?</p>
            <div className="popup-buttons">
              <button onClick={enviarComprovativoEmail} className="botao-confirmar">
                Por E-mail
              </button>
              <button onClick={downloadComprovativoPDF} className="botao-confirmar">
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarErroPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{mensagemErro}</p>
            <div className="popup-buttons">
              <button
                onClick={() => setMostrarErroPopup(false)}
                className="botao-confirmar"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default function DetalhesArtigo() {
  return (
    <>
      <HeaderProfileCares />
      <DetalhesItem />
    </>
  );
}
