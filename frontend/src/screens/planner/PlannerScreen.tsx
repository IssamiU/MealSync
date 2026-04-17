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
import { colors } from "../../theme/colors";

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Planejamento semanal</Text>
          <Text style={styles.subtitle}>
            Organize almoço e jantar de cada dia da semana com base nas suas
            receitas cadastradas.
          </Text>
        </View>

        {days.map((day) => (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayTitle}>{day}</Text>

            {mealTypes.map((mealType) => (
              <Pressable
                key={mealType}
                style={styles.mealRow}
                onPress={() => handleOpenSelector(day, mealType)}
              >
                <View style={styles.mealHeader}>
                  <Text style={styles.mealType}>{mealType}</Text>
                  <Text style={styles.mealAction}>Alterar</Text>
                </View>

                <Text style={styles.recipeName}>
                  {getRecipeName(day, mealType)}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Selecionar receita</Text>

            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalListContent}
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
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    paddingBottom: 24,
  },
  headerCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 0,
    borderColor: colors.border,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: colors.border,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  mealRow: {
    marginBottom: 10,
    padding: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: colors.border,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  mealType: {
    fontWeight: "700",
    fontSize: 15,
    color: colors.textPrimary,
  },
  mealAction: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  recipeName: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(59, 47, 47, 0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: colors.textPrimary,
  },
  modalListContent: {
    paddingBottom: 8,
  },
  recipeItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  recipeItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  clearButton: {
    marginTop: 8,
    paddingVertical: 13,
    backgroundColor: colors.danger,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 13,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
});