require("../bootstrap");

const dbConfig = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin"
  },
  pool: {
    max: Number(process.env.POSTGRES_POOLMAX) || 50,
    min: Number(process.env.POSTGRES_POOLMIN) || 10,
    acquire: Number(process.env.POSTGRES_POOLACQUIRE) || 30000,
    idle: Number(process.env.POSTGRES_POOLIDLE) || 10000
  },
  dialect: process.env.DB_DIALECT || "postgres",
  timezone: "UTC",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.POSTGRES_DB || "zpro",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "zpro",
  logging: false
};

module.exports = dbConfig;
