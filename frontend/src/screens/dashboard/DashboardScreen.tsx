import React, { useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { RootState } from "../../store";
import { signOut } from "../../store/slices/authSlice";
import { setRecipes } from "../../store/slices/recipesSlice";
import { normalizeRecipe } from "../../utils/normalizeRecipe";
import { API_URL } from "../../services/api";
import { removeAuth } from "../../storage/authStorage";
import { colors } from "../../theme/colors";

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const plannedMeals = useSelector(
    (state: RootState) => state.planner.plannedMeals
  );
  const shoppingItems = useSelector(
    (state: RootState) => state.shoppingList.items
  );

  const recipesCount = recipes.length;
  const favoritesCount = recipes.filter((r) => r.isFavorite).length;
  const plannedMealsCount = plannedMeals.length;
  const shoppingItemsCount = shoppingItems.length;

  const loadRecipes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar receitas");
      }

      dispatch(setRecipes(data.map(normalizeRecipe)));
    } catch (error) {
      console.log("Erro ao carregar receitas no dashboard:", error);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  async function handleLogout() {
    try {
      await removeAuth();
      dispatch(signOut());
    } catch (error) {
      console.log("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo semanal</Text>
        <Text style={styles.subtitle}>Olá, {user?.name ?? "usuário"}!</Text>
      </View>

      <Text style={styles.sectionTitle}>Visão geral</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{recipesCount}</Text>
          <Text style={styles.metricLabel}>Receitas cadastradas</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{favoritesCount}</Text>
          <Text style={styles.metricLabel}>Receitas favoritas</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{plannedMealsCount}</Text>
          <Text style={styles.metricLabel}>Refeições planejadas</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{shoppingItemsCount}</Text>
          <Text style={styles.metricLabel}>Itens na lista</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acessos rápidos</Text>

      <View style={styles.actionsContainer}>
        <Pressable
          style={styles.actionCard}
          onPress={() => navigation.navigate("CreateRecipe")}
        >
          <Text style={styles.actionTitle}>Cadastrar nova receita</Text>
          <Text style={styles.actionDescription}>
            Adicione uma nova receita ao seu app.
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => navigation.navigate("RecipesList")}
        >
          <Text style={styles.actionTitle}>Ver receitas cadastradas</Text>
          <Text style={styles.actionDescription}>
            Consulte, favorite e gerencie suas receitas.
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => navigation.navigate("Planner")}
        >
          <Text style={styles.actionTitle}>Planejamento semanal</Text>
          <Text style={styles.actionDescription}>
            Organize refeições para cada dia da semana.
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => navigation.navigate("ShoppingList")}
        >
          <Text style={styles.actionTitle}>Lista de compras</Text>
          <Text style={styles.actionDescription}>
            Gere e edite sua lista com base no planejamento.
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
    borderRadius: 18,
    padding: 18,
    borderWidth: 0,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});