export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  createdAt: string; // ISO string
  items: ShoppingListItem[];
};