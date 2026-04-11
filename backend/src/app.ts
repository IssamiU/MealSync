import express from "express";
import cors from "cors";

import recipeRoutes from "./routes/recipeRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API Comprinhas funcionando" });
});

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
export default app;