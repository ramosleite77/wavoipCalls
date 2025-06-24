import Call from '../models/Call';
import CallSchedulerService from './CallSchedulerService';

class CallService {

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

  async listCalls(tenantId: number, limit = 20, offset = 0) {
    const [calls, totalCalls] = await Promise.all([
      Call.findAll({
        where: { tenantId },
        limit,
        offset,
        order: [['id', 'DESC']]
      }),
      Call.count({ where: { tenantId } })
    ]);

    return {
      calls,
      totalCalls,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCalls / limit)
    };
  }

  async executeTestCall(id: number, tenantId: number) {
    return CallSchedulerService.executeCallById(id, tenantId);
  }
}

export default new CallService(); 