import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { addPlannedMeal } from "../../store/slices/plannerSlice";

const days = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const mealTypes = ["Almoço", "Jantar"];

export default function PlannerScreen() {
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const plannedMeals = useSelector(
    (state: RootState) => state.planner.plannedMeals
  );

  function handleSelectRecipe(day: string, mealType: string) {
    if (recipes.length === 0) return;

    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    dispatch(
      addPlannedMeal({
        id: Date.now().toString(),
        day: day as any,
        mealType: mealType as any,
        recipeId: randomRecipe.id,
      })
    );
  }

  function getRecipeName(day: string, mealType: string) {
    const meal = plannedMeals.find(
      (m) => m.day === day && m.mealType === mealType
    );

    if (!meal) return "Selecionar receita";

    const recipe = recipes.find((r) => r.id === meal.recipeId);
    return recipe ? recipe.title : "Receita não encontrada";
  }

  return (
    <ScrollView style={styles.container}>
      {days.map((day) => (
        <View key={day} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{day}</Text>

          {mealTypes.map((mealType) => (
            <Pressable
              key={mealType}
              style={styles.mealRow}
              onPress={() => handleSelectRecipe(day, mealType)}
            >
              <Text style={styles.mealType}>{mealType}</Text>
              <Text style={styles.recipeName}>
                {getRecipeName(day, mealType)}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 12,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  mealRow: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  mealType: {
    fontWeight: "600",
  },
  recipeName: {
    color: "#333",
  },
});