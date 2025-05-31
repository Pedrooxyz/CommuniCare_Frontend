import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./EditarItem.css";
import ToastBar from "../../../components/ToastBar/ToastBar.js";

const EditarItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    nomeItem: "",
    descItem: "",
    comissaoCares: 0,
    fotografiaItem: "",
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        const response = await api.get(`/ItensEmprestimo/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data[0];
        console.log("Item carregado da API:", data);
        setItem({
          nomeItem: data.nomeItem ?? "",
          descItem: data.descItem ?? "",
          comissaoCares: data.comissaoCares ?? 0,
          fotografiaItem: data.fotografiaItem ?? "",
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes do item:", error);
        setToast({
          message: error.message || "Erro ao carregar os detalhes do item.",
          type: "error",
        });
      }
    };

    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name} = ${value}`);
    setItem((prevItem) => ({
      ...prevItem,
      [name]: name === "comissaoCares" ? Math.min(parseInt(value, 10) || 0, 9999) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Tentando atualizar item:", item);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");
      const updatedItem = {
        nomeItem: item.nomeItem,
        descItem: item.descItem,
        comissaoCares: item.comissaoCares,
        fotografiaItem: item.fotografiaItem,
      };
      await api.put(`/ItensEmprestimo/AtualizarItem/${itemId}`, updatedItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        message: "Item atualizado com sucesso!",
        type: "success",
      });
      setTimeout(() => {
        navigate("/meusEmprestimos");
      }, 3000);
    } catch (error) {
      console.error("Erro ao atualizar o item:", error);
      setToast({
        message: error.response?.data?.mensagem || "Erro ao atualizar o item. Tente novamente.",
        type: "error",
      });
    }
  };

  return (
    <div className="editar-item">
      <h2>Editar Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nomeItem">Nome do Item</label>
          <input
            type="text"
            id="nomeItem"
            name="nomeItem"
            value={item.nomeItem}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descItem">Descrição do Item</label>
          <textarea
            id="descItem"
            name="descItem"
            value={item.descItem}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="comissaoCares">Comissão em Cares</label>
          <input
            type="number"
            id="comissaoCares"
            name="comissaoCares"
            value={item.comissaoCares}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <button type="submit" className="btn-submit">Atualizar</button>
      </form>

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

export default EditarItem;