import { Sequelize } from 'sequelize-typescript';
import User from '../models/User';
import Tenant from '../models/Tenant';
import Call from '../models/Call';
import CallLog from '../models/CallLog';
import WavoipToken from '../models/WavoipToken';
import VapiToken from '../models/VapiToken';
import ElevenLabToken from '../models/ElevenLabToken';
import Settings from '../models/Settings';
import CallSchedulerService from '../services/CallSchedulerService';
import SettingsService from '../services/SettingsService';
import logger from '../utils/logger';
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

sequelize.addModels([
  User, Tenant, Call, CallLog, WavoipToken, VapiToken, ElevenLabToken, Settings
]);

sequelize.authenticate().then(async () => {
  const tenants = await Tenant.findAll();
  for (const tenant of tenants) {
    let intervalSeconds = 60;
    try {
      const setting = await SettingsService.getSettingByType('interval', tenant.id);
      if (setting && setting.value && !isNaN(Number(setting.value))) {
        intervalSeconds = Number(setting.value);
      }
    } catch (e) {
      logger.warn(`Não foi possível buscar setting interval para tenant ${tenant.id}, usando padrão 60s`);
    }
    CallSchedulerService.startScheduler(intervalSeconds, tenant.id);
  }
}).catch((error) => {
  logger.error('Erro ao conectar com o banco: ' + (error instanceof Error ? error.message : String(error)));
});

export default sequelize;