import CallLog from '../models/CallLog';

class CallLogService {
  async createCallLog(data: any, tenantId: number) {
    return CallLog.create({ ...data, tenantId });
  }

  async getCallLogById(id: number, tenantId: number) {
    return CallLog.findOne({ where: { id, tenantId } });
  }

  async updateCallLog(id: number, data: any, tenantId: number) {
    return CallLog.update(data, { where: { id, tenantId } });
  }

  async deleteCallLog(id: number, tenantId: number) {
    return CallLog.destroy({ where: { id, tenantId } });
  }

  async listCallLogs(tenantId: number) {
    return CallLog.findAll({ where: { tenantId } });
  }
}

export default new CallLogService(); 