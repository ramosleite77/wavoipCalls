import axios from 'axios';
import { Op } from 'sequelize';
import Call from '../models/Call';
import VapiToken from '../models/VapiToken';
import WavoipToken from '../models/WavoipToken';
import CallLogService from './CallLogService';
import WavoipTokenService from './WavoipTokenService';

interface VapiCallResponse {
  id: string;
  status: string;
}

interface VapiPhoneNumberResponse {
  id: string;
  number: string;
}

class CallSchedulerService {

  async processScheduledCalls(): Promise<void> {
    try {
      console.log('Iniciando processamento de chamadas agendadas...');
      
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

      console.log(`Encontradas ${overdueCalls.length} chamadas vencidas`);

      for (const call of overdueCalls) {
        try {
          const isValid = await this.validatePhoneNumberAndWavoipToken(call);
          
          if (!isValid) {
            console.log(`Chamada ${call.id} não executada - validação falhou`);
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
          
          console.log(`Chamada ${call.id} executada com sucesso`);
        } catch (error) {
          console.error(`Erro ao executar chamada ${call.id}:`, error);
          
          // Salvar log do erro
          await CallLogService.createCallLog({
            callId: call.id,
            option: `Error: ${error instanceof Error ? error.message : String(error)}`
          }, call.tenantId);
          
        }
      }
    } catch (error) {
      console.error('Erro no processamento de chamadas agendadas:', error);
    }
  }

  private async validatePhoneNumberAndWavoipToken(call: Call): Promise<boolean> {
    try {
      // Buscar o token do Vapi
      const vapiToken = await VapiToken.findByPk(call.vapiTokenId);
      if (!vapiToken) {
        console.error(`Token Vapi não encontrado para a chamada ${call.id}`);
        return false;
      }

      const phoneResponse = await axios.get(`https://api.vapi.ai/phone-number/${call.phoneNumberId}`, {
        headers: {
          'Authorization': `Bearer ${vapiToken.token}`,
          'Content-Type': 'application/json'
        }
      });

      const phoneData: VapiPhoneNumberResponse = phoneResponse.data;
      console.log(`Phone number ${call.phoneNumberId}: ${phoneData.number}`);

      const wavoipToken = await WavoipToken.findOne({
        where: {
          name: phoneData.number.replace('+', ''),
          tenantId: call.tenantId
        }
      });

      if (!wavoipToken) {
        console.log(`WavoipToken não encontrado para o phone number ${phoneData.number}`);
        return false;
      }

      const deviceStatus = await WavoipTokenService.isDeviceAvailable(wavoipToken.token);
      
      if (!deviceStatus.available) {
        console.log(`Dispositivo não disponível para WavoipToken ${wavoipToken.name} - Call ID: ${deviceStatus.call?.call_id}`);
        return false;
      }

      console.log(`WavoipToken encontrado e disponível: ${wavoipToken.name} - Token: ${wavoipToken.token}`);

      return true;
    } catch (error) {
      console.error(`Erro na validação do phone number/WavoipToken para chamada ${call.id}:`, error);
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

    console.log(payload);

    const response = await axios.post('https://api.vapi.ai/call', payload, {
      headers: {
        'Authorization': `Bearer ${vapiToken.token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }


  startScheduler(intervalMinutes: number = 1): void {
    console.log(`Iniciando scheduler de chamadas com intervalo de ${intervalMinutes} minutos`);
    
    this.processScheduledCalls();
    
    setInterval(() => {
      this.processScheduledCalls();
    }, intervalMinutes * 60 * 1000);
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