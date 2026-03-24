export type MealType = "Café da manhã" | "Almoço" | "Jantar";

export type WeekDay =
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado"
  | "Domingo";

export type PlannedMeal = {
  id: string;
  day: WeekDay;
  mealType: MealType;
  recipeId: string;
};