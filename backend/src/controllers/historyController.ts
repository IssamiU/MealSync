import { Request, Response } from "express";
import { pool } from "../config/database";
import { Recipe } from "../models/Recipe";

export async function getHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    const result = await pool.query(
      `SELECT id, recipe_id, prepared_at
       FROM recipe_history
       WHERE user_id = $1
       ORDER BY prepared_at DESC
       LIMIT 50`,
      [userId]
    );

    const rows = result.rows;
    if (rows.length === 0) return res.json([]);

    const recipeIds = [...new Set(rows.map((r) => r.recipe_id))];
    const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();

    const recipeMap: Record<string, any> = {};
    recipes.forEach((r: any) => {
      recipeMap[String(r._id)] = {
        id: String(r._id),
        title: r.title,
        category: r.category,
        prepTimeMinutes: r.prepTimeMinutes,
        servings: r.servings,
      };
    });

    const history = rows.map((row) => ({
      id: row.id,
      recipeId: row.recipe_id,
      preparedAt: row.prepared_at,
      recipe: recipeMap[row.recipe_id] ?? null,
    }));

    return res.json(history);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return res.status(500).json({ message: "Erro ao buscar histórico" });
  }
}

export async function addToHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { recipeId } = req.body;

    if (!recipeId) {
      return res.status(400).json({ message: "recipeId é obrigatório" });
    }

    const result = await pool.query(
      `INSERT INTO recipe_history (user_id, recipe_id)
       VALUES ($1, $2)
       RETURNING id, recipe_id, prepared_at`,
      [userId, recipeId]
    );

    return res.status(201).json({
      id: result.rows[0].id,
      recipeId: result.rows[0].recipe_id,
      preparedAt: result.rows[0].prepared_at,
    });
  } catch (error) {
    console.error("Erro ao registrar histórico:", error);
    return res.status(500).json({ message: "Erro ao registrar histórico" });
  }
}

// DELETE /history/:id — apaga um registro específico do histórico
export async function deleteHistoryItem(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM recipe_history
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Registro não encontrado" });
    }

    return res.json({ message: "Registro removido do histórico" });
  } catch (error) {
    console.error("Erro ao apagar registro do histórico:", error);
    return res.status(500).json({ message: "Erro ao apagar registro" });
  }
}

// DELETE /history — apaga todo o histórico do usuário
export async function clearHistory(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    await pool.query(
      `DELETE FROM recipe_history WHERE user_id = $1`,
      [userId]
    );

    return res.json({ message: "Histórico apagado com sucesso" });
  } catch (error) {
    console.error("Erro ao apagar histórico:", error);
    return res.status(500).json({ message: "Erro ao apagar histórico" });
  }
}