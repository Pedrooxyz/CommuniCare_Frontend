import "./HistoricoTransacoes.css";
import { useState } from "react";
import iconCC from "../../assets/iconCC.jpg";
import backImage from '../../assets/back.jpg';
import icon from '../../assets/icon.jpg';
import { api } from '../../utils/axios.js';

const Header = () => {
  return (
    <header className="header ep">
      <img className="iconCC" src={iconCC} width={60} height={60} alt="IconCare" />
    </header>
  );
};

function HistoricoContent() {
  const [utilizadorId, setUtilizadorId] = useState("");
  const [historico, setHistorico] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCarregar = async () => {
    setMensagemErro("");
    setHistorico([]);

    if (!utilizadorId) {
      setMensagemErro("Por favor insira o ID do utilizador.");
      return;
    }

    setCarregando(true);
    try {
      const response = await api.get(`/Historico/${utilizadorId}`);
      if (response.data.length === 0) {
        setMensagemErro("Nenhum histórico encontrado.");
      } else {
        setHistorico(response.data);
      }
    } catch (error) {
      setMensagemErro("Erro ao carregar histórico.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="bgImg" style={{ backgroundImage: `url(${backImage})` }}></div>
      <div className="container">
        <h1 className="h1FP">Histórico de Transações</h1>
        <img className="iconImage" src={icon} width={100} height={100} alt="Icon" />
        <div className="form">
          <input
            className="inputDadosFP"
            type="number"
            placeholder="ID do Utilizador"
            value={utilizadorId}
            onChange={(e) => setUtilizadorId(e.target.value)}
          />
          <button className="buttonSubmit" onClick={handleCarregar} disabled={carregando}>
            {carregando ? "A carregar..." : "Carregar Histórico"}
          </button>

          {mensagemErro && <p className="pErros">{mensagemErro}</p>}

          {historico.length > 0 && (
            <table className="historico-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Carências</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => (
                  <tr key={item.transacaoId}>
                    <td>{item.transacaoId}</td>
                    <td>{item.tipo}</td>
                    <td>{item.data}</td>
                    <td>{item.numeroCarenciasTransferido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

function HistoricoTransacoes() {
  return (
    <>
      <Header />
      <HistoricoContent />
    </>
  );
}

export default HistoricoTransacoes;
