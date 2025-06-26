import axios from 'axios';
import { Op } from 'sequelize';
import Call from '../models/Call';
import VapiToken from '../models/VapiToken';
import WavoipToken from '../models/WavoipToken';
import CallLogService from './CallLogService';
import WavoipTokenService from './WavoipTokenService';
import SettingsService from './SettingsService';
import logger from '../utils/logger';

interface VapiCallResponse {
  id: string;
  status: string;
}

interface VapiPhoneNumberResponse {
  id: string;
  number: string;
}

class CallSchedulerService {
  private tenantSchedulers: Record<number, { intervalId: NodeJS.Timeout, currentInterval: number }> = {};

  async processScheduledCalls(): Promise<void> {
    try {
      logger.info('Iniciando processamento de chamadas agendadas...');
      
      const overdueCalls = await Call.findAll({
        where: {
          scheduleAt: {
            [Op.lte]: new Date()
          },
          executed: false
        },
        include: [
          {
            model: VapiToken,
            as: 'vapiToken',
            required: true
          }
        ]
      });

      logger.info(`Encontradas ${overdueCalls.length} chamadas vencidas`);

      for (const call of overdueCalls) {
        try {
          const isValid = await this.validatePhoneNumberAndWavoipToken(call);
          
          if (!isValid) {
            logger.warn(`Chamada ${call.id} não executada - validação falhou`);
            continue;
          }

          const response = await this.executeCall(call);
          
          // Salvar log do retorno da API
          await CallLogService.createCallLog({
            callId: call.id,
            option: `API Response: ${JSON.stringify(response)}`
          }, call.tenantId);
          
          // Marcar a chamada como executada
          await call.update({ executed: true });
          
          logger.info(`Chamada ${call.id} executada com sucesso`);
        } catch (error) {
          logger.error(`Erro ao executar chamada ${call.id}: ${error instanceof Error ? error.message : String(error)}`);
          
          // Salvar log do erro
          await CallLogService.createCallLog({
            callId: call.id,
            option: `Error: ${error instanceof Error ? error.message : String(error)}`
          }, call.tenantId);
          
        }
      }
    } catch (error) {
      logger.error('Erro no processamento de chamadas agendadas: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private async validatePhoneNumberAndWavoipToken(call: Call): Promise<boolean> {
    try {
      // Buscar o token do Vapi
      const vapiToken = await VapiToken.findByPk(call.vapiTokenId);
      if (!vapiToken) {
        logger.error(`Token Vapi não encontrado para a chamada ${call.id}`);
        return false;
      }

      const phoneResponse = await axios.get(`https://api.vapi.ai/phone-number/${call.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${vapiToken.token}`,
          'Content-Type': 'application/json'
        }
      });

      const phoneData: VapiPhoneNumberResponse = phoneResponse.data;
      logger.info(`Phone number ${call.phoneNumberId}: ${phoneData.number}`);

      // Buscar todos os WavoipTokens para este número de telefone
      const wavoipTokens = await WavoipToken.findAll({
        where: {
          name: phoneData.number.replace('+', ''),
          tenantId: call.tenantId
        }
      });

      if (wavoipTokens.length === 0) {
        logger.warn(`Nenhum WavoipToken encontrado para o phone number ${phoneData.number}`);
        return false;
      }

      logger.info(`Encontrados ${wavoipTokens.length} WavoipTokens para o número ${phoneData.number}`);

      // Testar cada token até encontrar um disponível
      for (const wavoipToken of wavoipTokens) {
        try {
          const deviceStatus = await WavoipTokenService.isDeviceAvailable(wavoipToken.token);
          
          if (deviceStatus.available) {
            logger.info(`WavoipToken disponível encontrado: ${wavoipToken.name} - Token: ${wavoipToken.token}`);
            return true;
          } else {
            logger.warn(`WavoipToken ${wavoipToken.name} não disponível - Call ID: ${deviceStatus.call?.call_id}`);
          }
        } catch (error) {
          logger.error(`Erro ao verificar disponibilidade do WavoipToken ${wavoipToken.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      logger.warn(`Nenhum WavoipToken disponível encontrado para o phone number ${phoneData.number}`);
      return false;

    } catch (error) {
      logger.error(`Erro na validação do phone number/WavoipToken para chamada ${call.id}: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  private async executeCall(call: Call): Promise<VapiCallResponse> {

    const vapiToken = await VapiToken.findByPk(call.vapiTokenId);
    
    if (!vapiToken) {
      throw new Error(`Token Vapi não encontrado para a chamada ${call.id}`);
    }

    const payload = {
      customers: [
        {
          number: call.customerNumber
        }
      ],
      assistantId: call.assistantId,
      phoneNumberId: call.phoneNumberId
    };

    logger.info(`Tenant ${call.tenantId} Payload da chamada: ${JSON.stringify(payload)}`);

    const response = await axios.post('https://api.vapi.ai/call', payload, {
      headers: {
        'Authorization': `Bearer ${vapiToken.token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  async startScheduler(initialIntervalSeconds: number = 60, tenantId: number): Promise<void> {
    let currentInterval = initialIntervalSeconds;
    // Função que executa o ciclo e verifica se precisa reiniciar
    const runScheduler = async () => {
      // Busca o valor mais recente da configuração
      let intervalSeconds = 60;
      try {
        const setting = await SettingsService.getSettingByType('interval', tenantId);
        if (setting && setting.value && !isNaN(Number(setting.value))) {
          intervalSeconds = Number(setting.value);
        }
      } catch (e) {
      }

      if (this.tenantSchedulers[tenantId] && intervalSeconds !== currentInterval) {
        clearInterval(this.tenantSchedulers[tenantId].intervalId);
        currentInterval = intervalSeconds;
        logger.info(`Tenant ${tenantId}: Intervalo alterado para ${intervalSeconds} segundos. Reiniciando scheduler.`);
        const intervalId = setInterval(runScheduler, intervalSeconds * 1000);
        this.tenantSchedulers[tenantId] = { intervalId, currentInterval: intervalSeconds };
        return;
      }
      await this.processScheduledCallsForTenant(tenantId);
    };
    if (this.tenantSchedulers[tenantId]) {
      clearInterval(this.tenantSchedulers[tenantId].intervalId);
    }
    logger.info(`Tenant ${tenantId}: Iniciando scheduler com intervalo de ${currentInterval} segundos.`);
    const intervalId = setInterval(runScheduler, currentInterval * 1000);
    this.tenantSchedulers[tenantId] = { intervalId, currentInterval };
    await runScheduler();
  }

  async processScheduledCallsForTenant(tenantId: number): Promise<void> {
    try {
      logger.info(`Processando chamadas agendadas para tenant ${tenantId}...`);
      const overdueCalls = await Call.findAll({
        where: {
          scheduleAt: {
            [Op.lte]: new Date()
          },
          executed: false,
          tenantId: tenantId
        },
        include: [
          {
            model: VapiToken,
            as: 'vapiToken',
            required: true
          }
        ]
      });
      logger.info(`Tenant ${tenantId}: Encontradas ${overdueCalls.length} chamadas vencidas`);
      for (const call of overdueCalls) {
        try {
          const isValid = await this.validatePhoneNumberAndWavoipToken(call);
          if (!isValid) {
            logger.warn(`Chamada ${call.id} não executada - validação falhou`);
            continue;
          }
          const response = await this.executeCall(call);
          await CallLogService.createCallLog({
            callId: call.id,
            option: `API Response: ${JSON.stringify(response)}`
          }, call.tenantId);
          await call.update({ executed: true });
          logger.info(`Chamada ${call.id} executada com sucesso`);
        } catch (error) {
          logger.error(`Erro ao executar chamada ${call.id}: ${error instanceof Error ? error.message : String(error)}`);
          await CallLogService.createCallLog({
            callId: call.id,
            option: `Error: ${error instanceof Error ? error.message : String(error)}`
          }, call.tenantId);
        }
      }
    } catch (error) {
      logger.error(`Erro no processamento de chamadas agendadas para tenant ${tenantId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async executeCallById(callId: number, tenantId: number): Promise<any> {
    const call = await Call.findOne({ where: { id: callId, tenantId } });
    if (!call) throw new Error('Call não encontrada');
    const isValid = await this.validatePhoneNumberAndWavoipToken(call);
    if (!isValid) throw new Error('Validação de número ou WavoipToken falhou');
    const response = await this.executeCall(call);
    await call.update({ executed: true });
    return response;
  }
}

export default new CallSchedulerService(); 