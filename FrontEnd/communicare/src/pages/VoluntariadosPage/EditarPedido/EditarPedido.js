import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./EditarPedido.css"; // Podes copiar ou adaptar a CSS de EditarItem

const EditarPedido = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState({
    titulo: "",
    descricao: "",
    numPessoas: 0,
    numHoras: 0,
  });

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await api.get(`/PedidosAjuda/${pedidoId}`);
        const data = response.data;

        console.log("Pedido carregado da API:", data);

        setPedido({
          titulo: data.titulo ?? "",
          descricao: data.descricao ?? "",
          numPessoas: data.numPessoas ?? 0,
          numHoras: data.numHoras ?? 0,
        });
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        alert("Erro ao carregar os detalhes do pedido.");
      }
    };

    fetchPedido();
  }, [pedidoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido((prevPedido) => ({
      ...prevPedido,
      [name]: name === "numPessoas" || name === "numHoras" ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPedido = {
        titulo: pedido.titulo,
        descricao: pedido.descricao,
        numPessoas: pedido.numPessoas,
        numHoras: pedido.numHoras,
      };

      await api.put(`/PedidosAjuda/AtualizarPedido/${pedidoId}`, updatedPedido);
      alert("Pedido atualizado com sucesso!");
      navigate("/meusPedidos"); // Ajusta o caminho para onde queres redirecionar
    } catch (error) {
      console.error("Erro ao atualizar o pedido:", error);
      alert("Erro ao atualizar o pedido. Tente novamente.");
    }
  };

  return (
    <div className="editar-pedido">
      <h2>Editar Pedido de Ajuda</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={pedido.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={pedido.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numPessoas">Número de Pessoas</label>
          <input
            type="number"
            id="numPessoas"
            name="numPessoas"
            value={pedido.numPessoas}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numHoras">Número de Horas</label>
          <input
            type="number"
            id="numHoras"
            name="numHoras"
            value={pedido.numHoras}
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

export default EditarPedido;
