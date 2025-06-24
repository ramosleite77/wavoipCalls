import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || "8080";

const server = app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

gracefulShutdown(server, {
  onShutdown: async () => {
    logger.info('Iniciando shutdown gracioso do servidor...');
  },
  finally: () => {
    logger.info('Servidor finalizado com sucesso.');
  }
});