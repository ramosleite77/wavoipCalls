import WavoipToken from '../models/WavoipToken';
import axios from 'axios';

class WavoipTokenService {
  async createWavoipToken(data: any, tenantId: number) {
    return WavoipToken.create({ ...data, tenantId });
  }

  async getWavoipTokenById(id: number, tenantId: number) {
    return WavoipToken.findOne({ where: { id, tenantId } });
  }

  async updateWavoipToken(id: number, data: any, tenantId: number) {
    await WavoipToken.update(data, { where: { id, tenantId } });
    return WavoipToken.findOne({ where: { id, tenantId } });
  }

  async deleteWavoipToken(id: number, tenantId: number) {
    return WavoipToken.destroy({ where: { id, tenantId } });
  }

  async getAllWavoipTokens() {
    return WavoipToken.findAll();
  }

  async isDeviceAvailable(token: string) {
    const url = `https://devices.wavoip.com/${token}/whatsapp/all_info`;
    const response = await axios.get(url);
    const data: any = response.data.result;

    // Disponível se call_id for null
    const available = data.call && data.call.call_id === null;

    // Retorna status e todos os dados relevantes
    return {
      available,
      call: data.call,
      phone: data.phone,
      integrations: data.integrations,
      status: data.status
    };
  }
}

export default new WavoipTokenService(); 