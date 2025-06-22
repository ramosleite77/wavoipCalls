import { Sequelize } from 'sequelize-typescript';
import User from '../models/User';
import Tenant from '../models/Tenant';
import Call from '../models/Call';
import CallLog from '../models/CallLog';
import WavoipToken from '../models/WavoipToken';
import VapiToken from '../models/VapiToken';
import sequelizeConfig from '../config/database';

const sequelize = new Sequelize(sequelizeConfig);

sequelize.addModels([User, Tenant, Call, CallLog, WavoipToken, VapiToken]);

export default sequelize;
