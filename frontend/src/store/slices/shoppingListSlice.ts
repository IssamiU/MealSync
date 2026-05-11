import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShoppingList, ShoppingListItem } from "../../types/shopping";

type ShoppingListState = {
  lists: ShoppingList[];
  // Mantido para compatibilidade com o DashboardScreen que conta shoppingItems
  items: ShoppingListItem[];
};

const initialState: ShoppingListState = {
  lists: [],
  items: [],
};

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    // ─── Gerenciamento de listas ────────────────────────────────────────────

    createList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },

    renameList: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const list = state.lists.find((l) => l.id === action.payload.id);
      if (list) list.name = action.payload.name;
    },

    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((l) => l.id !== action.payload);
      // Atualiza o contador do dashboard
      state.items = state.lists.flatMap((l) => l.items);
    },

    // ─── Itens dentro de uma lista específica ───────────────────────────────

    setShoppingList: (
      state,
      action: PayloadAction<{ listId: string; items: ShoppingListItem[] }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.items = action.payload.items;
        state.items = state.lists.flatMap((l) => l.items);
      }
    },

    addShoppingListItem: (
      state,
      action: PayloadAction<{ listId: string; item: ShoppingListItem }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.items.push(action.payload.item);
        state.items = state.lists.flatMap((l) => l.items);
      }
    },

    removeShoppingListItem: (
      state,
      action: PayloadAction<{ listId: string; itemId: string }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.items = list.items.filter((i) => i.id !== action.payload.itemId);
        state.items = state.lists.flatMap((l) => l.items);
      }
    },

    toggleShoppingListItem: (
      state,
      action: PayloadAction<{ listId: string; itemId: string }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        const item = list.items.find((i) => i.id === action.payload.itemId);
        if (item) item.checked = !item.checked;
      }
    },

    updateShoppingListItem: (
      state,
      action: PayloadAction<{ listId: string; item: ShoppingListItem }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        const index = list.items.findIndex((i) => i.id === action.payload.item.id);
        if (index !== -1) {
          list.items[index] = action.payload.item;
          state.items = state.lists.flatMap((l) => l.items);
        }
      }
    },

    clearShoppingList: (state, action: PayloadAction<string>) => {
      const list = state.lists.find((l) => l.id === action.payload);
      if (list) {
        list.items = [];
        state.items = state.lists.flatMap((l) => l.items);
      }
    },
  },
});

export const {
  createList,
  renameList,
  deleteList,
  setShoppingList,
  addShoppingListItem,
  removeShoppingListItem,
  toggleShoppingListItem,
  updateShoppingListItem,
  clearShoppingList,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;