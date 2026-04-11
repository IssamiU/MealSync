import { Request, Response } from "express";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe";

function formatRecipe(recipe: any) {
  const obj = recipe.toObject ? recipe.toObject() : recipe;

  return {
    ...obj,
    id: String(obj._id),
  };
}

function getParamId(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return null;
}

export async function createRecipe(req: Request, res: Response) {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();

    return res.status(201).json(formatRecipe(recipe));
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    return res.status(500).json({ message: "Erro ao criar receita" });
  }
}

export async function getRecipes(_req: Request, res: Response) {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });

    return res.json(recipes.map(formatRecipe));
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return res.status(500).json({ message: "Erro ao buscar receitas" });
  }
}

export async function getRecipeById(req: Request, res: Response) {
  try {
    const id = getParamId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de receita inválido" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }

    return res.json(formatRecipe(recipe));
  } catch (error) {
    console.error("Erro ao buscar receita por ID:", error);
    return res.status(500).json({ message: "Erro ao buscar receita" });
  }
}

export async function toggleFavorite(req: Request, res: Response) {
  try {
    const id = getParamId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de receita inválido" });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }

    recipe.isFavorite = !recipe.isFavorite;
    await recipe.save();

    return res.json(formatRecipe(recipe));
  } catch (error) {
    console.error("Erro ao atualizar favorito:", error);
    return res.status(500).json({ message: "Erro ao atualizar favorito" });
  }
}

export async function deleteRecipe(req: Request, res: Response) {
  try {
    const id = getParamId(req.params.id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de receita inválido" });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }

    return res.json({ message: "Receita removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar receita:", error);
    return res.status(500).json({ message: "Erro ao deletar receita" });
  }
}