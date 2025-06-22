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
    return WavoipToken.update(data, { where: { id, tenantId } });
  }

  async deleteWavoipToken(id: number, tenantId: number) {
    return WavoipToken.destroy({ where: { id, tenantId } });
  }

  async isDeviceAvailable(token: string): Promise<boolean> {
    const url = `https://devices.wavoip.com/${token}/whatsapp/all_info`;
    const response = await axios.get(url);
    const data: any = response.data;
    return data.call.call_id === null;
  }
}

export default new WavoipTokenService(); 