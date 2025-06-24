import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/style.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState([]);
  const [newSettingType, setNewSettingType] = useState('');
  const [newSettingValue, setNewSettingValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  // Estados para edição
  const [editingSetting, setEditingSetting] = useState<any>(null);
  const [editSettingType, setEditSettingType] = useState('');
  const [editSettingValue, setEditSettingValue] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados para exclusão
  const [deletingSetting, setDeletingSetting] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Opções disponíveis para tipos de configuração
  const settingTypes = [
    { value: 'interval', label: 'Intervalo (segundos)' },
    // { value: 'timeout', label: 'Timeout (segundos)' },
    // { value: 'max_retries', label: 'Máximo de Tentativas' },
    // { value: 'webhook_url', label: 'URL do Webhook' },
    // { value: 'notification_email', label: 'Email de Notificação' },
    // { value: 'custom', label: 'Personalizado' }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const response = await axios.get('/api/settings/tenant/all?tenantId=1');
      setSettings(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setErrors({ general: 'Erro ao carregar configurações' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createSetting = async () => {
    if (!newSettingType || !newSettingValue) {
      setErrors({ create: 'Preencha o tipo e o valor da configuração.' });
      return;
    }
    try {
      await axios.post('/api/settings', { 
        type: newSettingType, 
        value: newSettingValue, 
        tenantId: 1 
      });
      setNewSettingType('');
      setNewSettingValue('');
      fetchData();
    } catch (error: any) {
      console.error('Erro ao criar configuração:', error);
      if (error.response?.status === 400 && error.response?.data?.error?.includes('unique')) {
        setErrors({ create: 'Já existe uma configuração com este tipo para este tenant.' });
      } else {
        setErrors({ create: 'Erro ao criar configuração' });
      }
    }
  };

  const openEditModal = (setting: any) => {
    setEditingSetting(setting);
    setEditSettingType(setting.type);
    setEditSettingValue(setting.value);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSetting(null);
    setEditSettingType('');
    setEditSettingValue('');
  };

  const updateSetting = async () => {
    if (editingSetting && editSettingType && editSettingValue) {
      try {
        await axios.put(`/api/settings/${editingSetting.id}`, {
          type: editSettingType,
          value: editSettingValue,
          tenantId: 1
        });
        closeEditModal();
        fetchData();
      } catch (error: any) {
        console.error('Erro ao atualizar configuração:', error);
        if (error.response?.status === 400 && error.response?.data?.error?.includes('unique')) {
          setErrors({ update: 'Já existe uma configuração com este tipo para este tenant.' });
        } else {
          setErrors({ update: 'Erro ao atualizar configuração' });
        }
      }
    }
  };

  const openDeleteModal = (setting: any) => {
    setDeletingSetting(setting);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingSetting(null);
  };

  const deleteSetting = async () => {
    if (deletingSetting) {
      try {
        await axios.delete(`/api/settings/${deletingSetting.id}?tenantId=1`);
        closeDeleteModal();
        fetchData();
      } catch (error) {
        console.error('Erro ao deletar configuração:', error);
        setErrors({ delete: 'Erro ao deletar configuração' });
      }
    }
  };

  // Função para verificar se o tipo selecionado deve usar input number
  const isNumberInput = (type: string) => {
    return ['interval', 'timeout', 'max_retries'].includes(type);
  };

  // Função para obter o placeholder baseado no tipo
  const getValuePlaceholder = (type: string) => {
    switch (type) {
      case 'interval':
        return 'Segundos (ex: 30)';
      case 'timeout':
        return 'Segundos (ex: 60)';
      case 'max_retries':
        return 'Número (ex: 3)';
      case 'webhook_url':
        return 'https://api.exemplo.com/webhook';
      case 'notification_email':
        return 'admin@exemplo.com';
      default:
        return 'Valor da Configuração';
    }
  };

  return (
    <div className="wavoip-page-bg">
      <div className="wavoip-container">
        <h1 className="wavoip-title">Configurações do Sistema</h1>
        {errors.general && <div className="wavoip-error">{errors.general}</div>}
        {errors.create && <div className="wavoip-error">{errors.create}</div>}
        {errors.update && <div className="wavoip-error">{errors.update}</div>}
        {errors.delete && <div className="wavoip-error">{errors.delete}</div>}
        <div className="wavoip-add-bar">
          <select
            value={newSettingType}
            onChange={(e) => setNewSettingType(e.target.value)}
            className="wavoip-input"
            style={{ minWidth: '200px' }}
          >
            <option value="">Selecione o tipo</option>
            {settingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <input
            type={isNumberInput(newSettingType) ? 'number' : 'text'}
            value={newSettingValue}
            onChange={(e) => setNewSettingValue(e.target.value)}
            placeholder={getValuePlaceholder(newSettingType)}
            className="wavoip-input"
            min={isNumberInput(newSettingType) ? '1' : undefined}
          />
          <button onClick={createSetting} disabled={loading} className="wavoip-btn wavoip-btn-primary">Adicionar Configuração</button>
        </div>
        {loading && <div className="wavoip-loading">Carregando...</div>}
        <div className="wavoip-table-wrapper">
          <table className="wavoip-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting: any) => (
                <tr key={setting.id}>
                  <td style={{ fontWeight: 600, color: '#00a884' }}>{setting.type}</td>
                  <td style={{ maxWidth: 300, wordBreak: 'break-all', fontSize: 14 }}>{setting.value}</td>
                  <td style={{ fontSize: 13, color: '#b0b0b0' }}>
                    {new Date(setting.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ fontSize: 13, color: '#b0b0b0' }}>
                    {new Date(setting.updatedAt).toLocaleString('pt-BR')}
                  </td>
                  <td>
                    <button onClick={() => openEditModal(setting)} className="wavoip-btn wavoip-btn-edit">
                      <EditIcon fontSize="inherit" style={{ fontSize: 16 }} />
                    </button>
                    <button onClick={() => openDeleteModal(setting)} className="wavoip-btn wavoip-btn-delete">
                      <DeleteIcon fontSize="inherit" style={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal de Edição */}
        {showEditModal && (
          <div className="wavoip-modal-bg">
            <div className="wavoip-modal">
              <h3>Editar Configuração</h3>
              <div className="wavoip-modal-field">
                <label>Tipo:</label>
                <select
                  value={editSettingType}
                  onChange={(e) => setEditSettingType(e.target.value)}
                  className="wavoip-input"
                >
                  {settingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="wavoip-modal-field">
                <label>Valor:</label>
                <input
                  type={isNumberInput(editSettingType) ? 'number' : 'text'}
                  value={editSettingValue}
                  onChange={(e) => setEditSettingValue(e.target.value)}
                  placeholder={getValuePlaceholder(editSettingType)}
                  className="wavoip-input"
                  min={isNumberInput(editSettingType) ? '1' : undefined}
                />
              </div>
              <div className="wavoip-modal-actions">
                <button onClick={closeEditModal} className="wavoip-btn">Cancelar</button>
                <button onClick={updateSetting} className="wavoip-btn wavoip-btn-primary">
                  <EditIcon fontSize="inherit" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }} />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div className="wavoip-modal-bg">
            <div className="wavoip-modal">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja deletar a configuração "{deletingSetting?.type}"?</p>
              <p className="wavoip-modal-warn">Esta ação não pode ser desfeita.</p>
              <div className="wavoip-modal-actions">
                <button onClick={closeDeleteModal} className="wavoip-btn">Cancelar</button>
                <button onClick={deleteSetting} className="wavoip-btn wavoip-btn-delete">
                  <DeleteIcon fontSize="inherit" style={{ fontSize: 16, marginRight: 6, verticalAlign: 'middle' }} />
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 