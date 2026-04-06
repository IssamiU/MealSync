import dotenv from "dotenv";
import app from "./app";
import { pool } from "./config/database";
import { initDb } from "./config/initDb";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    await initDb();

    console.log("Banco de dados conectado com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
}

startServer();