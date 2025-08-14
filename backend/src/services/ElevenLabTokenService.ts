import ElevenLabToken from '../models/ElevenLabToken';
import axios from 'axios';

class ElevenLabTokenService {
  async createElevenLabToken(data: any, tenantId: number) {
    return ElevenLabToken.create({ ...data, tenantId });
  }

  async getElevenLabTokenById(id: number, tenantId: number) {
    return ElevenLabToken.findOne({ where: { id, tenantId } });
  }

  async updateElevenLabToken(id: number, data: any, tenantId: number) {
    await ElevenLabToken.update(data, { where: { id, tenantId } });
    return ElevenLabToken.findOne({ where: { id, tenantId } });
  }

  async deleteElevenLabToken(id: number, tenantId: number) {
    return ElevenLabToken.destroy({ where: { id, tenantId } });
  }

  async listAgents(elevenLabToken: string) {
    const response = await axios.get('https://api.elevenlabs.io/v1/convai/agents', {
      headers: {
        'xi-api-key': elevenLabToken,
      },
    });

    return response.data;
  }

  async listPhoneNumbers(elevenLabToken: string) {
    const response = await axios.get('https://api.elevenlabs.io/v1/convai/phone-numbers', {
      headers: {
        'xi-api-key': elevenLabToken,
      },
    });

    return response.data;
  }

  async makeOutboundCall(elevenLabToken: string, agentId: string, agentPhoneNumberId: string, toNumber: string, conversationInitiationClientData?: any) {
    const response = await axios.post('https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call', {
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      to_number: toNumber,
      conversation_initiation_client_data: conversationInitiationClientData,
    }, {
      headers: {
        'xi-api-key': elevenLabToken,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async getAllElevenLabTokens() {
    return ElevenLabToken.findAll();
  }
}

export default new ElevenLabTokenService();
