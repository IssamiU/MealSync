import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../../types/recipe";

type RecipesState = {
  recipes: Recipe[];
};

const initialState: RecipesState = {
  recipes: [],
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },

    updateRecipe(state, action: PayloadAction<Recipe>) {
      const index = state.recipes.findIndex(
        (r) => r.id === action.payload.id
      );

      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
  },
});

export const { setRecipes, updateRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;