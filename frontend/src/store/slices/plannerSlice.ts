import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlannedMeal } from "../../types/planner";

type PlannerState = {
  plannedMeals: PlannedMeal[];
};

type ClearBySlotPayload = {
  day: PlannedMeal["day"];
  mealType: PlannedMeal["mealType"];
};

type UpdateReminderPayload = {
  mealId: string;
  reminderTime: PlannedMeal["reminderTime"];
};

const initialState: PlannerState = {
  plannedMeals: [],
};

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    addPlannedMeal: (state, action: PayloadAction<PlannedMeal>) => {
      state.plannedMeals.push(action.payload);
    },

    removePlannedMeal: (state, action: PayloadAction<string>) => {
      state.plannedMeals = state.plannedMeals.filter(
        (meal) => meal.id !== action.payload
      );
    },

    clearPlannedMealBySlot: (state, action: PayloadAction<ClearBySlotPayload>) => {
      state.plannedMeals = state.plannedMeals.filter(
        (meal) =>
          !(meal.day === action.payload.day && meal.mealType === action.payload.mealType)
      );
    },

    clearPlanner: (state) => {
      state.plannedMeals = [];
    },

    // RF27 — atualiza o lembrete de uma refeição específica
    updateMealReminder: (state, action: PayloadAction<UpdateReminderPayload>) => {
      const meal = state.plannedMeals.find((m) => m.id === action.payload.mealId);
      if (meal) {
        meal.reminderTime = action.payload.reminderTime;
      }
    },
  },
});

export const {
  addPlannedMeal,
  removePlannedMeal,
  clearPlannedMealBySlot,
  clearPlanner,
  updateMealReminder,
} = plannerSlice.actions;

export default plannerSlice.reducer;