import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../../types/recipe";

type RecipesState = {
  recipes: Recipe[];
};

const initialState: RecipesState = {
  recipes: [
    {
      id: "1",
      title: "Macarrão com legumes",
      ingredients: [
        { id: "1", name: "Macarrão", quantity: 500, unit: "g" },
        { id: "2", name: "Cenoura", quantity: 2, unit: "un" },
        { id: "3", name: "Abobrinha", quantity: 1, unit: "un" },
      ],
      steps: [
        { id: "1", description: "Cozinhe o macarrão." },
        { id: "2", description: "Refogue os legumes." },
        { id: "3", description: "Misture tudo e sirva." },
      ],
      prepTimeMinutes: 30,
      servings: 4,
      category: "Almoço",
      imageUrl: "",
      isFavorite: false,
    },
    {
      id: "2",
      title: "Panqueca de banana",
      ingredients: [
        { id: "1", name: "Banana", quantity: 2, unit: "un" },
        { id: "2", name: "Ovo", quantity: 2, unit: "un" },
        { id: "3", name: "Aveia", quantity: 3, unit: "colheres" },
      ],
      steps: [
        { id: "1", description: "Amasse a banana." },
        { id: "2", description: "Misture com ovos e aveia." },
        { id: "3", description: "Asse em frigideira." },
      ],
      prepTimeMinutes: 15,
      servings: 2,
      category: "Café da manhã",
      imageUrl: "",
      isFavorite: true,
    },
  ],
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe.id !== action.payload
      );
    },
    toggleFavoriteRecipe: (state, action: PayloadAction<string>) => {
      const recipe = state.recipes.find((item) => item.id === action.payload);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
      }
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );

      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
  },
});

export const {
  addRecipe,
  removeRecipe,
  toggleFavoriteRecipe,
  updateRecipe,
} = recipesSlice.actions;

export default recipesSlice.reducer;