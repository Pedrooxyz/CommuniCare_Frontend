import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./EditarItem.css";

const EditarItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({
    nomeItem: "",
    descItem: "",
    comissaoCares: 0,
    fotografiaItem: "",  
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await api.get(`/ItensEmprestimo/${itemId}`);
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
        alert("Erro ao carregar os detalhes do item.");
      }
    };

    fetchItem();
  }, [itemId]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setItem((prevItem) => ({
    ...prevItem,
    [name]: name === "comissaoCares" ? Math.min(parseInt(value, 10) || 0, 9999) : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedItem = {
        nomeItem: item.nomeItem,
        descItem: item.descItem,
        comissaoCares: item.comissaoCares,
        fotografiaItem: item.fotografiaItem, 
      };
      
      await api.put(`/ItensEmprestimo/AtualizarItem/${itemId}`, updatedItem);
      alert("Item atualizado com sucesso!");
      navigate("/meusEmprestimos");
    } catch (error) {
      console.error("Erro ao atualizar o item:", error);
      alert("Erro ao atualizar o item. Tente novamente.");
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
    </div>
  );
};

export default EditarItem;
