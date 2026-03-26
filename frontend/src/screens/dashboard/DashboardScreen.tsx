import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { signOut } from "../../store/slices/authSlice";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const recipesCount = useSelector(
    (state: RootState) => state.recipes.recipes.length
  );
  const favoritesCount = useSelector(
    (state: RootState) =>
      state.recipes.recipes.filter((recipe) => recipe.isFavorite).length
  );
  const plannedMealsCount = useSelector(
    (state: RootState) => state.planner.plannedMeals.length
  );
  const shoppingItemsCount = useSelector(
    (state: RootState) => state.shoppingList.items.length
  );

  function handleLogout() {
    dispatch(signOut());
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo semanal</Text>
      <Text style={styles.subtitle}>Olá, {user?.name ?? "usuário"}!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Receitas cadastradas</Text>
        <Text>{recipesCount} receitas no aplicativo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Receitas favoritas</Text>
        <Text>{favoritesCount} receitas favoritas</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Planejamento semanal</Text>
        <Text>{plannedMealsCount} refeições planejadas</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lista de compras</Text>
        <Text>{shoppingItemsCount} itens na lista</Text>
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Cadastrar nova receita"
          onPress={() => navigation.navigate("CreateRecipe")}
        />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Ver receitas cadastradas"
          onPress={() => navigation.navigate("RecipesList")}
        />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Planejamento semanal"
          onPress={() => navigation.navigate("Planner")}
        />
      </View>

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
});