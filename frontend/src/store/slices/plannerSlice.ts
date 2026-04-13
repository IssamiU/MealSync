import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlannedMeal } from "../../types/planner";

type PlannerState = {
  plannedMeals: PlannedMeal[];
};

const initialState: PlannerState = {
  plannedMeals: [],
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    addPlannedMeal: (state, action: PayloadAction<PlannedMeal>) => {
      const alreadyExists = state.plannedMeals.find(
        (meal) =>
          meal.day === action.payload.day &&
          meal.mealType === action.payload.mealType
      );

      if (alreadyExists) {
        alreadyExists.recipeId = action.payload.recipeId;
        return;
      }

      state.plannedMeals.push(action.payload);
    },
    removePlannedMeal: (state, action: PayloadAction<string>) => {
      state.plannedMeals = state.plannedMeals.filter(
        (meal) => meal.id !== action.payload
      );
    },
    clearPlanner: (state) => {
      state.plannedMeals = [];
    },
  },
});

export const { addPlannedMeal, removePlannedMeal, clearPlanner } =
  plannerSlice.actions;

export default plannerSlice.reducer;