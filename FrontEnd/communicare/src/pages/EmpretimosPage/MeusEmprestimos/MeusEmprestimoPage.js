import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { api } from "../../../utils/axios.js";
import "./MeusEmprestimosPage.css";
import HeaderProfileCares from "../../../components/HeaderProfile/headerProfile.js";
import ToastBar from "../../../components/ToastBar/ToastBar.js";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.js";
import cares from "../../../assets/Cares.png";
import cortaRelva from "../../../assets/cortaRelva.jpg";
import iconFallback from '../../../assets/icon.jpg';

const Search = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const [userTipoUtilizadorId, setUserTipoUtilizadorId] = useState(null);

  const verificarTipoUtilizador = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const response = await api.get("/Utilizadores/VerificarAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserTipoUtilizadorId(response.data);
    } catch (error) {
      setUserTipoUtilizadorId(false);
      setToast({
        message: error.message || "Erro ao verificar o tipo de utilizador.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    verificarTipoUtilizador();
  }, []);

  const handleClickPendentes = () => {
    if (userTipoUtilizadorId === true) {
      navigate("/PendentesEmprestimos");
    } else {
      setToast({
        message: "Apenas administradores podem aceder a esta página!",
        type: "error",
      });
    }
  };

  const [toast, setToast] = useState(null);

  return (
    <div>
      <div className="mainName">
        <h1>Empréstimos</h1>
      </div>
      <div className="tabsME">
        <div className="choose">
          <button className="tabME active" onClick={() => navigate("/meusEmprestimos")}>
            Meus Empréstimos
          </button>
          <button className="tabME" onClick={() => navigate("/outrosEmprestimos")}>Outros Emprestimos</button>
          {userTipoUtilizadorId === true && (
            <button className="tabME" onClick={handleClickPendentes}>
              Empréstimos Pendentes
            </button>
          )}
        </div>
        <div className="search-wrapper1">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="search1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
          <FaSearch className="search-icon1" />
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
};

const ListaItems = ({ searchTerm }) => {
  const [items, setItems] = useState([]);
  const [itensEmUso, setItensEmUso] = useState([]);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", action: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get("/ItensEmprestimo/MeusItens", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);

        const responseEmUso = await api.get("/ItensEmprestimo/MeusItensEmUso", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItensEmUso(responseEmUso.data);
      } catch (error) {
        setToast({
          message: error.message || "Erro ao buscar itens.",
          type: "error",
        });
      }
    };

    fetchItems();
  }, []);

  const getImagemSrc = (fotografiaItem) => {
    if (fotografiaItem && fotografiaItem.trim() !== "") {
      return `data:image/jpeg;base64,${fotografiaItem}`;
    } else {
      return cortaRelva;
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/editarItem/${itemId}`);
  };

  const handleDelete = (itemId) => {
    setModal({
      isOpen: true,
      message: "Tem certeza que deseja indisponibilizar permanentemente este item?",
      action: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token de autenticação não encontrado.");
          const response = await api.delete(`/ItensEmprestimo/IndisponibilizarPermanenteItem/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 204) {
            setToast({
              message: "Item indisponibilizado com sucesso!",
              type: "success",
            });
            setTimeout(() => {
              setItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
            }, 3000);
          } else {
            setToast({
              message: "Erro ao indisponibilizar o item. Tente novamente.",
              type: "error",
            });
          }
        } catch (error) {
          setToast({
            message: error.response?.data?.mensagem || "Erro ao indisponibilizar o item. Tente novamente.",
            type: "error",
          });
        }
        setModal({ isOpen: false, message: "", action: null });
      },
    });
  };

  const handleCancelModal = () => {
    setModal({ isOpen: false, message: "", action: null });
  };

  const isItemEmUso = (item) => {
    return itensEmUso.some((itemUso) => itemUso.nomeItem === item.nomeItem);
  };

  const concluirEmprestimo = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const emprestimoResponse = await api.get(`/Emprestimos/EmprestimoCorrespondenteItem/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emprestimoCorrespondente = emprestimoResponse.data;

      if (emprestimoCorrespondente) {
        const response = await api.post(`/Emprestimos/DevolucaoItem/${emprestimoCorrespondente.emprestimoId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setToast({
            message: "Devolução concluída com sucesso!",
            type: "success",
          });
          setTimeout(() => {
            setItensEmUso((prevItens) => prevItens.filter((item) => item.itemId !== itemId));
          }, 3000);
        } else {
          setToast({
            message: "Erro ao concluir a devolução.",
            type: "error",
          });
        }
      } else {
        setToast({
          message: "Nenhum empréstimo encontrado para este item.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.mensagem || "Erro ao concluir devolução.",
        type: "error",
      });
    }
  };

  const filteredItems = items.filter(item =>
    item.nomeItem.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="cardsME">
      <div className="cardME adicionar-card" onClick={() => navigate("/pedirEmprestimo")}>
        <div className="TitleME">
          <h2>Adicionar Item</h2>
        </div>
        <div className="adicionarIcon">+</div>
      </div>

      {filteredItems.map((item) => (
        <div className="cardME" key={item.itemId}>
          <div className="TitleOE">
            <h2>{item.nomeItem}</h2>
          </div>
          <img
            className="imgItemMP"
            src={getImagemSrc(item.fotografiaItem)}
            alt={item.nomeItem}
          />
          <div className="descME">
            <h>{item.descItem || "Sem descrição disponível."}</h>
          </div>
          <div className="infoItemME1">
            <span>
              <img src={cares} width={35} height={35} alt="Cares" /> {item.comissaoCares}/h
            </span>
          </div>
          <div className="estadoEAcao">
            <span>
              Estado:
              <span
                className={`estado-circle ${isItemEmUso(item)
                  ? "em-uso"
                  : item.disponivel === 1
                    ? "disponivel"
                    : item.disponivel === 0
                      ? "indisponivel"
                      : item.disponivel === 2
                        ? "permanentemente-indisponivel"
                        : ""
                  }`}
              >
                {isItemEmUso(item)
                  ? "Em Uso"
                  : item.disponivel === 1
                    ? "Disponível"
                    : item.disponivel === 0
                      ? "Pendente"
                      : item.disponivel === 2
                        ? "Ind. Permanente"
                        : ""}
              </span>
            </span>
            {isItemEmUso(item) && (
              <button onClick={() => concluirEmprestimo(item.itemId)} className="concluir-button">
                Concluir
              </button>
            )}
            {!isItemEmUso(item) && (item.disponivel === 1 || item.disponivel === 0) && (
              <div className="controlesAcao">
                <button className="EditDeleteButtonsME" onClick={() => handleEdit(item.itemId)}>
                  <FaEdit />
                </button>
                <button className="EditDeleteButtonsME" onClick={() => handleDelete(item.itemId)}>
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {modal.isOpen && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.action}
          onCancel={handleCancelModal}
        />
      )}
    </div>
  );
};

function MeusEmprestimos() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HeaderProfileCares />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ListaItems searchTerm={searchTerm} />
    </>
  );
}

export default MeusEmprestimos;