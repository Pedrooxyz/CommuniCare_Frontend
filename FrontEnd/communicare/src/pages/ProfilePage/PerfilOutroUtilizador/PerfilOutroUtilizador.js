import "./PerfilOutroUtilizador.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaChevronRight } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/axios.js";

import defaultProfile from "../../../assets/icon.jpg";
import notification from "../../../assets/notification.jpg";
import plusP from "../../../assets/plusProfile.png";
import cares from "../../../assets/Cares.png";
import loja from "../../../assets/loja.png";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";



const mapTipoContacto = (tipoId) => {
  switch (tipoId) {
    case 1:
      return "Email";
    case 2:
      return "Contacto Telefónico";
    default:
      return "Desconhecido";
  }
};

const DadosUserPI = ({ userId }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [meusItens, setMeusItens] = useState([]);
  const [pedidosDisponiveis, setPedidosDisponiveis] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        console.log(`[DadosUserPI] Buscando dados para o utilizador com ID: ${userId}`);
        const userResponse = await api.get(`/Utilizadores/InfoUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((err) => {
          throw new Error(`Falha ao buscar informações do utilizador: ${err.message}`);
        });

        const contactosResponse = await api.get(`/Contactos/ContactosUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] }));

        const itensResponse = await api.get(`/ItensEmprestimo/ItensUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] }));

        const pedidosResponse = await api.get(`/PedidosAjuda/PedidosUtilizador/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: [] }));


        setUserInfo(userResponse.data);
        setContactos(contactosResponse.data);
        setMeusItens(itensResponse.data);
        setPedidosDisponiveis(pedidosResponse.data);
      } catch (error) {
        console.error("[DadosUserPI] Erro ao buscar dados:", error);
        setError(`Erro ao carregar os dados do perfil: ${error.message}`);
      }
    };

    if (userId) {
      fetchUserInfo();
    } else {
      console.error("[DadosUserPI] ID do utilizador não fornecido.");
      setError("ID do utilizador não fornecido.");
    }
  }, [userId]);

  if (error) return <p className="error-message">{error}</p>;
  if (!userInfo) return <p className="loading-message">Carregando perfil...</p>;

  return (
    <div>
      <div className="info">
        <div className="IconProfile">
          <img
            className="icPerson"
            src={userInfo.fotoUtil ? `http://localhost:5182${userInfo.fotoUtil}` : defaultProfile}
            alt="Imagem de Perfil"
          />
        </div>
      </div>

      <div className="gridProfile">
        <div className="cardPofile profile">
          <h2 className="name">{userInfo.nomeUtilizador ?? "..."}</h2>
          <h3>Contactos:</h3>
          {contactos.length > 0 ? (
            contactos.map((contacto, index) => (
              <p key={index} className="contact">
                {mapTipoContacto(contacto.tipoContactoId)}: {contacto.numContacto}
              </p>
            ))
          ) : (
            <p className="contact">Nenhum contacto disponível</p>
          )}
          <span className="ellipsis"></span>
        </div>

        <div className="cardPofile">
          <h2 className="section">Pedidos de Ajuda</h2>
          <div className="recent">
            <h4 className="recent-name">Recentes:</h4>
            <div className="recent-items">
              {pedidosDisponiveis.length > 0 ? (
                pedidosDisponiveis.map((pedido) => (
                  <div
                    key={pedido.pedidoAjudaId}
                    className="item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/maisInfoPedidos/${pedido.pedidoId}`)}
                  >
                    {pedido.titulo}
                  </div>
                ))
              ) : (
                <p className="contact">Nenhum pedido disponível.</p>
              )}
            </div>
          </div>
        </div>

        <div className="cardPofile">
          <h2 className="section">Empréstimos</h2>
          <div className="recent">
            <h4 className="recent-name">Recentes:</h4>
            <div className="recent-items">
              {meusItens.length > 0 ? (
                meusItens.map((item) => (
                  <div
                    key={item.itemId}
                    className="item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/maisInfo/${item.itemId}`)}
                  >
                    {item.nomeItem}
                  </div>
                ))
              ) : (
                <p className="contact">Nenhum item encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PerfilOutroUtilizador() {
  const { userId } = useParams();
  console.log("[PerfilOutroUtilizador] Parâmetros completos:", useParams());
  console.log("[PerfilOutroUtilizador] ID extraído da URL:", userId);

  if (!userId) {
    return <p className="error-message">Erro: ID do utilizador não fornecido na URL. Verifique a URL (ex.: /PerfilOutroUtilizador/2).</p>;
  }

  return (
    <>
      <HeaderProfileCares userId={userId} />
      <DadosUserPI userId={userId} />
    </>
  );
}

export default PerfilOutroUtilizador;