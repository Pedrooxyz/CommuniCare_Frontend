import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/axios.js";
import "./EditarPedido.css";
import ToastBar from '../../../components/ToastBar/ToastBar.js';

const EditarPedido = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

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
                    descricao: data.descPedido ?? "",
                    numPessoas: data.nPessoas ?? 0,
                    numHoras: data.nHoras ?? 0,
                });
            } catch (error) {
                console.error("Erro ao buscar detalhes do pedido:", error);
                setToast({ message: "Erro ao carregar os detalhes do pedido.", type: "error" });

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
                Titulo: pedido.titulo,
                DescPedido: pedido.descricao,
                NPessoas: pedido.numPessoas,
                NHoras: pedido.numHoras,
            };


            await api.put(`/PedidosAjuda/AtualizarPedido/${pedidoId}`, updatedPedido);
            setToast({ message: "Pedido atualizado com sucesso!", type: "success" });
            setTimeout(() => navigate("/meusPedidos"), 2500);
        } catch (error) {
            console.error("Erro ao atualizar o pedido:", error);
            setToast({ message: "Erro ao atualizar o pedido. Tente novamente.", type: "error" });
        }
    };

    return (
        <div className="editar-pedido">
            {toast && (
                <ToastBar
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
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
