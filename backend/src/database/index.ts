import { Sequelize } from 'sequelize-typescript';
import User from '../models/User';
import Tenant from '../models/Tenant';
import Call from '../models/Call';
import CallLog from '../models/CallLog';
import WavoipToken from '../models/WavoipToken';
import VapiToken from '../models/VapiToken';
import CallSchedulerService from '../services/CallSchedulerService';
const dbConfig = require("../config/database");

const sequelize = new Sequelize(dbConfig);

sequelize.addModels([
  User, Tenant, Call, CallLog, WavoipToken, VapiToken
]);

sequelize.authenticate().then(() => {
  CallSchedulerService.startScheduler(1); // 10 segundos = 1/6 de minuto
}).catch((error) => {
  console.error('Erro ao conectar com o banco:', error);
});

export default sequelize;