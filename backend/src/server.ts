import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";

const PORT = process.env.PORT || "8080";

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

gracefulShutdown(server);