export type MealType =
  | "Café da manhã"
  | "Almoço"
  | "Lanche"
  | "Jantar"
  | "Outros";

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
  reminderTime?: {
    hour: number;
    minute: number;
    notificationId: string; // para cancelar/substituir ao editar
  } | null;
};