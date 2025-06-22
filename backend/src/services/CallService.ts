import Call from '../models/Call';
import Tenant from '../models/Tenant';

class CallService {
  static async createCall(tenantId: number, customerNumber: string, assistantId: string, phoneNumberId: string) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    const call = await Call.create({
      customerNumber,
      assistantId,
      phoneNumberId,
      tenantId
    });

    return call;
  }

  static async listCalls(tenantId: number) {
    const calls = await Call.findAll({
      where: { tenantId }
    });

    return calls;
  }

  async createCall(data: any, tenantId: number) {
    return Call.create({ ...data, tenantId });
  }

  async getCallById(id: number, tenantId: number) {
    return Call.findOne({ where: { id, tenantId } });
  }

  async updateCall(id: number, data: any, tenantId: number) {
    return Call.update(data, { where: { id, tenantId } });
  }

  async deleteCall(id: number, tenantId: number) {
    return Call.destroy({ where: { id, tenantId } });
  }
}

export default new CallService(); 