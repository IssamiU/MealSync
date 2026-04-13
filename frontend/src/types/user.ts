export type FoodPreferences = {
  vegetarian: boolean;
  glutenFree: boolean;
  lactoseFree: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  preferences: FoodPreferences;
};