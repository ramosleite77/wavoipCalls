import { Dialect } from 'sequelize';

const sequelizeConfig = {
  database: 'calls',
  dialect: 'postgres' as Dialect,
  username: 'calls',
  password: 'password',
  port: 5437,
  host: 'localhost',
  models: [__dirname + '/models'],
};

export default sequelizeConfig;