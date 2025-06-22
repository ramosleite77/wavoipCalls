import Tenant from '../models/Tenant';

class TenantService {
  async createTenant(data: any) {
    return Tenant.create(data);
  }

  async getTenantById(id: number) {
    return Tenant.findByPk(id);
  }

  async updateTenant(id: number, data: any) {
    return Tenant.update(data, { where: { id } });
  }

  async deleteTenant(id: number) {
    return Tenant.destroy({ where: { id } });
  }
}

export default new TenantService(); 