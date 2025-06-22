import express from 'express';
import sequelize from './database/index';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => console.log('Erro ao conectar ao banco de dados:', err));

app.use('/api', routes);