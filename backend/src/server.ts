import dotenv from "dotenv";
import app from "./app";
import { connectMongo } from "./config/mongo";
import { pool } from "./config/database";
import { initDb } from "./config/initDb";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    await initDb();
    await connectMongo();

    console.log("Banco de dados conectado com sucesso.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar no banco:", error);
  }
}

startServer();