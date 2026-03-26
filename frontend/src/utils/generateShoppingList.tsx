import { Recipe } from "../types/recipe";
import { PlannedMeal } from "../types/planner";
import { ShoppingListItem } from "../types/shopping";

export function generateShoppingListFromPlanner(
  plannedMeals: PlannedMeal[],
  recipes: Recipe[]
): ShoppingListItem[] {
  const aggregatedMap = new Map<string, ShoppingListItem>();

  for (const meal of plannedMeals) {
    const recipe = recipes.find((item) => item.id === meal.recipeId);

    if (!recipe) continue;

    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.name.trim().toLowerCase()}-${ingredient.unit
        .trim()
        .toLowerCase()}`;

      const existingItem = aggregatedMap.get(key);

      if (existingItem) {
        existingItem.quantity += ingredient.quantity;
      } else {
        aggregatedMap.set(key, {
          id: `${ingredient.name}-${ingredient.unit}`,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          checked: false,
        });
      }
    }
  }

  return Array.from(aggregatedMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
}