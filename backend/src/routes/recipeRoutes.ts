import { Router } from "express";
import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipes,
  toggleFavorite,
} from "../controllers/recipeController";

const router = Router();

router.post("/", createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteRecipe);

export default router;