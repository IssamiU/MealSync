import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import plannerReducer from "./slices/plannerSlice";
import recipesReducer from "./slices/recipesSlice";
import shoppingListReducer from "./slices/shoppingListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    planner: plannerReducer,
    shoppingList: shoppingListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;