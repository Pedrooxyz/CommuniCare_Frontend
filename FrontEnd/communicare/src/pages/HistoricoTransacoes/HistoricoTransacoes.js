import { useEffect, useState } from 'react';
import { api } from '../../utils/axios';
import './HistoricoTransacoes.css';
import HeaderProfileCares from '../../components/HeaderProfile/headerProfile';

function HistoricoTransacoes() {
  const [userInfo, setUserInfo] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      const response = await api.get('/Utilizadores/InfoUtilizador', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Erro ao buscar info do utilizador:', error);
      setMensagemErro(error.message || 'Erro ao carregar informações do utilizador.');
      setIsLoading(false);
    }
  };

  const fetchHistorico = async (utilizadorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`Transacoes/Historico/${utilizadorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorico(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setMensagemErro(error.message || 'Erro ao carregar histórico de transações.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.utilizadorId) {
      fetchHistorico(userInfo.utilizadorId);
    }
  }, [userInfo]);

  const handleRetry = () => {
    setMensagemErro('');
    setIsLoading(true);
    fetchUserInfo();
  };

  return (
  <div>
    <HeaderProfileCares />
    <div className="historico-container">
      <h2 className="titulo-historico">Histórico de Transações</h2>
      
      {mensagemErro && (
        <div className="erro">
          <p>{mensagemErro}</p>
          <button onClick={handleRetry}>Tentar novamente</button>
        </div>
      )}

      {isLoading && !mensagemErro && <p className="loading">A carregar histórico...</p>}

      {!isLoading && !mensagemErro && historico.length === 0 && (
        <p className="no-data">Nenhuma transação encontrada.</p>
      )}

      {!isLoading && historico.length > 0 && (
        <table className="tabela-historico">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Título</th>
              <th>Data</th>
              <th>Cares</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((transacao) => (
              <tr key={transacao.transacaoId}>
                <td>{transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)}</td>
                <td>{transacao.titulo || 'Sem título'}</td>
                <td>{transacao.data}</td>
                <td>{transacao.numeroCarenciasTransferido ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
}

export default HistoricoTransacoes;