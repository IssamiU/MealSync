import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import {
  addPlannedMeal,
  clearPlannedMealBySlot,
} from "../../store/slices/plannerSlice";

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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  function openSelector(day: string, mealType: string) {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedDay(null);
    setSelectedMealType(null);
  }

  function selectRecipe(recipeId: string) {
    if (!selectedDay || !selectedMealType) return;

    dispatch(
      addPlannedMeal({
        id: Date.now().toString(),
        day: selectedDay as any,
        mealType: selectedMealType as any,
        recipeId,
      })
    );

    closeModal();
  }

  function clearSelectedRecipe() {
    if (!selectedDay || !selectedMealType) return;

    dispatch(
      clearPlannedMealBySlot({
        day: selectedDay as any,
        mealType: selectedMealType as any,
      })
    );

    closeModal();
  }

  function getRecipeName(day: string, mealType: string) {
    const meal = plannedMeals.find(
      (m) => m.day === day && m.mealType === mealType
    );

    if (!meal) return "Selecionar receita";

    const recipe = recipes.find((r) => r.id === meal.recipeId);
    return recipe ? recipe.title : "Receita não encontrada";
  }

  function hasSelectedRecipeForCurrentSlot() {
    if (!selectedDay || !selectedMealType) return false;

    return plannedMeals.some(
      (meal) =>
        meal.day === selectedDay && meal.mealType === selectedMealType
    );
  }

  function handleOpenSelector(day: string, mealType: string) {
    if (recipes.length === 0) {
      Alert.alert(
        "Atenção",
        "Cadastre pelo menos uma receita antes de montar o planejamento."
      );
      return;
    }

    openSelector(day, mealType);
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {days.map((day) => (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayTitle}>{day}</Text>

            {mealTypes.map((mealType) => (
              <Pressable
                key={mealType}
                style={styles.mealRow}
                onPress={() => handleOpenSelector(day, mealType)}
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

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecionar receita</Text>

          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recipeItem}
                onPress={() => selectRecipe(item.id)}
              >
                <Text style={styles.recipeItemText}>{item.title}</Text>
              </Pressable>
            )}
          />

          {hasSelectedRecipeForCurrentSlot() && (
            <Pressable
              style={styles.clearButton}
              onPress={clearSelectedRecipe}
            >
              <Text style={styles.clearButtonText}>Deixar sem receita</Text>
            </Pressable>
          )}

          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    </>
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
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  recipeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  recipeItemText: {
    fontSize: 16,
  },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "600",
  },
});