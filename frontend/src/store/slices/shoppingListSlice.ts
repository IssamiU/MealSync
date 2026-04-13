import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShoppingListItem } from "../../types/shopping";

type ShoppingListState = {
  items: ShoppingListItem[];
};

const initialState: ShoppingListState = {
  items: [],
};

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    setShoppingList: (state, action: PayloadAction<ShoppingListItem[]>) => {
      state.items = action.payload;
    },
    addShoppingListItem: (state, action: PayloadAction<ShoppingListItem>) => {
      state.items.push(action.payload);
    },
    removeShoppingListItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleShoppingListItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
    },
    updateShoppingListItem: (state, action: PayloadAction<ShoppingListItem>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    clearShoppingList: (state) => {
      state.items = [];
    },
  },
});

export const {
  setShoppingList,
  addShoppingListItem,
  removeShoppingListItem,
  toggleShoppingListItem,
  updateShoppingListItem,
  clearShoppingList,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;