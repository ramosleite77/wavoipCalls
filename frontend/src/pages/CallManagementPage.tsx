import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../css/style.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const TENANT_ID = 1;

const CallManagementPage: React.FC = () => {
  const [calls, setCalls] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCalls, setTotalCalls] = useState(0);
  const [callsPerPage] = useState(10);

  // VapiToken e dependentes
  const [vapiTokens, setVapiTokens] = useState<any[]>([]);
  const [selectedVapiToken, setSelectedVapiToken] = useState<string>('');
  const [assistants, setAssistants] = useState<any[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);

  // Estados para criação/edição de Call
  const [showCallModal, setShowCallModal] = useState(false);
  const [editingCall, setEditingCall] = useState<any>(null);
  const [callForm, setCallForm] = useState({
    customerNumber: '',
    assistantId: '',
    phoneNumberId: '',
    scheduleAt: ''
  });

  // Estados para criação/edição de Log
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);
  const [logForm, setLogForm] = useState({
    callId: '',
    option: ''
  });

  // Estado para modal de log por ligação
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [selectedCallLogs, setSelectedCallLogs] = useState<any[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  // Estado para call a ser duplicada
  const [pendingDuplicate, setPendingDuplicate] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const callsResponse = await axios.get(`/api/calls?tenantId=${TENANT_ID}&limit=${callsPerPage}&offset=${(currentPage - 1) * callsPerPage}`);
      setCalls(callsResponse.data.calls);
      setTotalCalls(callsResponse.data.totalCalls);
      const logsResponse = await axios.get(`/api/call-logs?tenantId=${TENANT_ID}`);
      setLogs(logsResponse.data);
      // Carregar VapiTokens
      const vapiResponse = await axios.get('/api/vapi-tokens');
      setVapiTokens(vapiResponse.data);
    } catch (error) {
      setErrors({ general: 'Erro ao carregar dados' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, callsPerPage]);

  // Funções de navegação de páginas
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(totalCalls / callsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Buscar assistants e phoneNumbers ao selecionar VapiToken
  const fetchAssistantsAndPhones = async (vapiId: string) => {
    try {
      const assistantsRes = await axios.get(`/api/vapi-tokens/${vapiId}/assistants?tenantId=${TENANT_ID}`);
      setAssistants(assistantsRes.data);
      const phonesRes = await axios.get(`/api/vapi-tokens/${vapiId}/phone-numbers?tenantId=${TENANT_ID}`);
      setPhoneNumbers(phonesRes.data);
    } catch {
      setAssistants([]);
      setPhoneNumbers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Atualiza selects ao abrir modal de edição/criação
  useEffect(() => {
    if (showCallModal) {
      if (editingCall) {
        setSelectedVapiToken(editingCall.vapiTokenId || '');
        setCallForm({
          customerNumber: editingCall.customerNumber,
          assistantId: editingCall.assistantId,
          phoneNumberId: editingCall.phoneNumberId,
          scheduleAt: editingCall.scheduleAt ? editingCall.scheduleAt.substring(0, 16) : ''
        });
        if (editingCall.vapiTokenId) fetchAssistantsAndPhones(editingCall.vapiTokenId);
      } else {
        setSelectedVapiToken('');
        setAssistants([]);
        setPhoneNumbers([]);
        setCallForm({ customerNumber: '', assistantId: '', phoneNumberId: '', scheduleAt: '' });
      }
    }
  }, [showCallModal, editingCall]);

  // Atualiza selects ao trocar VapiToken
  useEffect(() => {
    if (selectedVapiToken) fetchAssistantsAndPhones(selectedVapiToken);
    else {
      setAssistants([]);
      setPhoneNumbers([]);
      setCallForm(f => ({ ...f, assistantId: '', phoneNumberId: '' }));
    }
  }, [selectedVapiToken]);

  // Efeito para preencher o formulário após carregar assistants/phones
  useEffect(() => {
    if (showCallModal && pendingDuplicate && selectedVapiToken) {
      setCallForm({
        customerNumber: pendingDuplicate.customerNumber,
        assistantId: pendingDuplicate.assistantId,
        phoneNumberId: pendingDuplicate.phoneNumberId,
        scheduleAt: pendingDuplicate.scheduleAt ? pendingDuplicate.scheduleAt.substring(0, 16) : ''
      });
      setPendingDuplicate(null);
    }
  }, [showCallModal, pendingDuplicate, selectedVapiToken, assistants.length, phoneNumbers.length]);

  // CRUD Calls
  const openCallModal = (call: any = null) => {
    setEditingCall(call);
    setShowCallModal(true);
  };

  const closeCallModal = () => {
    setShowCallModal(false);
    setEditingCall(null);
    setCallForm({ customerNumber: '', assistantId: '', phoneNumberId: '', scheduleAt: '' });
    setSelectedVapiToken('');
    setAssistants([]);
    setPhoneNumbers([]);
  };

  const saveCall = async () => {
    if (!selectedVapiToken) {
      setErrors({ call: 'Selecione um VapiToken' });
      return;
    }
    try {
      const payload = {
        ...callForm,
        vapiTokenId: selectedVapiToken,
        tenantId: TENANT_ID
      };
      if (editingCall) {
        await axios.put(`/api/calls/${editingCall.id}`, payload);
      } else {
        await axios.post('/api/calls', payload);
      }
      closeCallModal();
      fetchData();
    } catch (error) {
      setErrors({ call: 'Erro ao salvar ligação' });
    }
  };

  const deleteCall = async (call: any) => {
    try {
      await axios.delete(`/api/calls/${call.id}?tenantId=${TENANT_ID}`);
      fetchData();
    } catch (error) {
      setErrors({ call: 'Erro ao deletar ligação' });
    }
  };

  const closeLogModal = () => {
    setShowLogModal(false);
    setEditingLog(null);
    setLogForm({ callId: '', option: '' });
  };

  const saveLog = async () => {
    try {
      if (editingLog) {
        await axios.put(`/api/call-logs/${editingLog.id}`, { ...logForm, tenantId: TENANT_ID });
      } else {
        await axios.post('/api/call-logs', { ...logForm, tenantId: TENANT_ID });
      }
      closeLogModal();
      fetchData();
    } catch (error) {
      setErrors({ log: 'Erro ao salvar log' });
    }
  };

  // Função para abrir modal de log de uma ligação
  const openCallLogModal = (callId: string) => {
    setSelectedCallId(callId);
    setSelectedCallLogs(logs.filter((log: any) => String(log.callId) === String(callId)));
    setShowCallLogModal(true);
  };

  const closeCallLogModal = () => {
    setShowCallLogModal(false);
    setSelectedCallLogs([]);
    setSelectedCallId(null);
  };

  // Função para duplicar uma call
  const duplicateCall = (call: any) => {
    setEditingCall(null); // Nova call
    setPendingDuplicate(call); // Salva dados para preencher depois
    setSelectedVapiToken(call.vapiTokenId || '');
    setShowCallModal(true);
  };

  // Função para executar teste da call
  const executeTestCall = async (call: any) => {
    setErrors({});
    try {
      await axios.post(`/api/calls/${call.id}/execute-test?tenantId=${TENANT_ID}`);
      fetchData();
      alert('Chamada executada com sucesso!');
    } catch (error: any) {
      setErrors({ call: error?.response?.data?.error || 'Erro ao executar chamada de teste' });
      alert('Erro ao executar chamada de teste!');
    }
  };

  return (
    <div className="wavoip-page-bg">
      <div className="wavoip-container">
        <h1 className="wavoip-title">Gerenciamento de Ligações</h1>
        {errors.general && <div className="wavoip-error">{errors.general}</div>}
        {errors.call && <div className="wavoip-error">{errors.call}</div>}
        <button onClick={() => openCallModal()} className="wavoip-btn wavoip-btn-primary" style={{ marginBottom: 16 }}>Nova Ligação</button>
        {loading && <div className="wavoip-loading">Carregando...</div>}
        <div className="wavoip-table-wrapper" style={{ marginBottom: 32 }}>
          <table className="wavoip-table">
            <thead>
              <tr>
                <th style={{ minWidth: 140, wordBreak: 'break-all' }}>Cliente</th>
                <th style={{ minWidth: 180, wordBreak: 'break-all' }}>Assistente</th>
                <th style={{ minWidth: 180, wordBreak: 'break-all' }}>Telefone</th>
                <th style={{ minWidth: 150 }}>Agendada para</th>
                <th style={{ minWidth: 100 }}>Status</th>
                <th style={{ minWidth: 160, textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: any) => (
                <tr key={call.id} style={{ background: call.executed ? '#1e2e1e' : '#2e2a1e' }}>
                  <td style={{ wordBreak: 'break-all', padding: '10px 8px' }}>{call.customerNumber}</td>
                  <td style={{ maxWidth: 220, wordBreak: 'break-all', fontSize: 13, color: '#b0b0b0', padding: '10px 8px' }}>{call.assistantId}</td>
                  <td style={{ maxWidth: 220, wordBreak: 'break-all', fontSize: 13, color: '#b0b0b0', padding: '10px 8px' }}>{call.phoneNumberId}</td>
                  <td style={{ maxWidth: 220, wordBreak: 'break-all', fontSize: 13, color: '#b0b0b0', padding: '10px 8px' }}>{call.scheduleAt ? new Date(call.scheduleAt).toLocaleString() : '-'}</td>
                  <td style={{ maxWidth: 220, wordBreak: 'break-all', fontSize: 13, color: '#b0b0b0', padding: '10px 8px' }}>
                    <span className={call.executed ? 'wavoip-status-ok' : 'wavoip-status-warn'}>
                      {call.executed ? '✓ Executada' : '⏳ Pendente'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                      <button onClick={() => openCallModal(call)} className="wavoip-btn wavoip-btn-edit"><EditIcon fontSize="inherit" style={{ fontSize: 16 }} /></button>
                      <button onClick={() => deleteCall(call)} className="wavoip-btn wavoip-btn-delete"><DeleteIcon fontSize="inherit" style={{ fontSize: 16 }} /></button>
                      <button onClick={() => openCallLogModal(call.id)} className="wavoip-btn" title="Ver Log"><ListAltIcon fontSize="inherit" style={{ fontSize: 16 }} /></button>
                      <button onClick={() => duplicateCall(call)} className="wavoip-btn" title="Duplicar"><ContentCopyIcon fontSize="inherit" style={{ fontSize: 16 }} /></button>
                      <button onClick={() => executeTestCall(call)} className="wavoip-btn" title="Executar Teste"><PlayArrowIcon fontSize="inherit" style={{ fontSize: 16 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginação */}
        {totalCalls > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ color: '#b0b0b0', fontSize: 14 }}>
              Mostrando {((currentPage - 1) * callsPerPage) + 1} a {Math.min(currentPage * callsPerPage, totalCalls)} de {totalCalls} ligações
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="wavoip-btn"
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <NavigateBeforeIcon fontSize="small" />
              </button>
              
              {/* Números das páginas */}
              {Array.from({ length: Math.min(5, Math.ceil(totalCalls / callsPerPage)) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`wavoip-btn ${currentPage === pageNum ? 'wavoip-btn-primary' : ''}`}
                    style={{ minWidth: 40, height: 36 }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={goToNextPage} 
                disabled={currentPage >= Math.ceil(totalCalls / callsPerPage)}
                className="wavoip-btn"
                style={{ opacity: currentPage >= Math.ceil(totalCalls / callsPerPage) ? 0.5 : 1 }}
              >
                <NavigateNextIcon fontSize="small" />
              </button>
            </div>
          </div>
        )}

        {/* Modal de Call */}
        {showCallModal && (
          <div className="wavoip-modal-bg">
            <div className="wavoip-modal">
              <h3>{editingCall ? 'Editar Ligação' : 'Nova Ligação'}</h3>
              <div className="wavoip-modal-field">
                <label>VapiToken:</label>
                <select value={selectedVapiToken} onChange={e => setSelectedVapiToken(e.target.value)} className="wavoip-input">
                  <option value="">Selecione...</option>
                  {vapiTokens.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="wavoip-modal-field">
                <label>Cliente:</label>
                <input type="text" value={callForm.customerNumber} onChange={e => setCallForm(f => ({ ...f, customerNumber: e.target.value }))} className="wavoip-input" />
              </div>
              <div className="wavoip-modal-field">
                <label>Assistente:</label>
                <select value={callForm.assistantId} onChange={e => setCallForm(f => ({ ...f, assistantId: e.target.value }))} className="wavoip-input" disabled={!selectedVapiToken}>
                  <option value="">Selecione...</option>
                  {assistants.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="wavoip-modal-field">
                <label>Telefone:</label>
                <select value={callForm.phoneNumberId} onChange={e => setCallForm(f => ({ ...f, phoneNumberId: e.target.value }))} className="wavoip-input" disabled={!selectedVapiToken}>
                  <option value="">Selecione...</option>
                  {phoneNumbers.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.number}</option>
                  ))}
                </select>
              </div>
              <div className="wavoip-modal-field">
                <label>Agendar para:</label>
                <input type="datetime-local" value={callForm.scheduleAt} onChange={e => setCallForm(f => ({ ...f, scheduleAt: e.target.value }))} className="wavoip-input" />
              </div>
              <div className="wavoip-modal-actions">
                <button onClick={closeCallModal} className="wavoip-btn">Cancelar</button>
                <button onClick={saveCall} className="wavoip-btn wavoip-btn-primary"><EditIcon fontSize="small" style={{ marginRight: 6, verticalAlign: 'middle' }} />Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Log */}
        {showLogModal && (
          <div className="wavoip-modal-bg">
            <div className="wavoip-modal">
              <h3>{editingLog ? 'Editar Log' : 'Novo Log'}</h3>
              <div className="wavoip-modal-field">
                <label>CallId:</label>
                <input type="text" value={logForm.callId} onChange={e => setLogForm(f => ({ ...f, callId: e.target.value }))} className="wavoip-input" />
              </div>
              <div className="wavoip-modal-field">
                <label>Opção:</label>
                <input type="text" value={logForm.option} onChange={e => setLogForm(f => ({ ...f, option: e.target.value }))} className="wavoip-input" />
              </div>
              <div className="wavoip-modal-actions">
                <button onClick={closeLogModal} className="wavoip-btn">Cancelar</button>
                <button onClick={saveLog} className="wavoip-btn wavoip-btn-primary"><EditIcon fontSize="small" style={{ marginRight: 6, verticalAlign: 'middle' }} />Salvar</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de Log por Ligação */}
        {showCallLogModal && (
          <div className="wavoip-modal-bg">
            <div className="wavoip-modal">
              <h3>Logs da Ligação</h3>
              <div style={{ marginBottom: 16, color: '#b0b0b0', fontSize: 14 }}>
                <b>CallId:</b> {selectedCallId}
              </div>
              <div style={{ maxHeight: 350, overflow: 'auto' }}>
                {selectedCallLogs.length === 0 ? (
                  <div style={{ color: '#ffb300' }}>Nenhum log encontrado para esta ligação.</div>
                ) : (
                  <table className="wavoip-table" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <thead>
                      <tr>
                        <th>Opção</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCallLogs.map((log: any) => (
                        <tr key={log.id}>
                          <td>{log.option}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="wavoip-modal-actions">
                <button onClick={closeCallLogModal} className="wavoip-btn">Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallManagementPage; 