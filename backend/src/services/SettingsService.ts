import Settings from '../models/Settings';

class SettingsService {
  async createSetting(data: any, tenantId: number) {
    return Settings.create({ ...data, tenantId });
  }

  async getSettingById(id: number, tenantId: number) {
    return Settings.findOne({ where: { id, tenantId } });
  }

  async getSettingByType(type: string, tenantId: number) {
    return Settings.findOne({ where: { type, tenantId } });
  }

  async updateSetting(id: number, data: any, tenantId: number) {
    return Settings.update(data, { where: { id, tenantId } });
  }

  async updateSettingByType(type: string, data: any, tenantId: number) {
    return Settings.update(data, { where: { type, tenantId } });
  }

  async deleteSetting(id: number, tenantId: number) {
    return Settings.destroy({ where: { id, tenantId } });
  }

  async deleteSettingByType(type: string, tenantId: number) {
    return Settings.destroy({ where: { type, tenantId } });
  }

  async listSettings(tenantId: number, limit = 20, offset = 0) {
    const [settings, totalSettings] = await Promise.all([
      Settings.findAll({
        where: { tenantId },
        limit,
        offset,
        order: [['type', 'ASC']]
      }),
      Settings.count({ where: { tenantId } })
    ]);

    return {
      settings,
      totalSettings,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalSettings / limit)
    };
  }

  async getAllSettingsByTenant(tenantId: number) {
    return Settings.findAll({
      where: { tenantId },
      order: [['type', 'ASC']]
    });
  }
}

export default new SettingsService(); 