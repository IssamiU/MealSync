import React from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { toggleFavoriteRecipe } from "../../store/slices/recipesSlice";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecipeDetails">;

export default function RecipeDetailsScreen({ route }: Props) {
  const dispatch = useDispatch();
  const { recipeId } = route.params;

  const recipe = useSelector((state: RootState) =>
    state.recipes.recipes.find((item) => item.id === recipeId)
  );

  if (!recipe) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundTitle}>Receita não encontrada</Text>
        <Text style={styles.notFoundText}>
          Não foi possível localizar esta receita.
        </Text>
      </View>
    );
  }

  function handleToggleFavorite() {
    if (!recipe) return;

    const wasFavorite = recipe.isFavorite;

    dispatch(toggleFavoriteRecipe(recipe.id));

    Alert.alert(
        "Favoritos",
        wasFavorite
        ? "Receita removida dos favoritos."
        : "Receita adicionada aos favoritos."
    );
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.meta}>Categoria: {recipe.category}</Text>
        <Text style={styles.meta}>
          Tempo de preparo: {recipe.prepTimeMinutes} min
        </Text>
        <Text style={styles.meta}>Porções: {recipe.servings}</Text>
        <Text style={styles.meta}>
          Favorita: {recipe.isFavorite ? "Sim" : "Não"}
        </Text>

        <View style={styles.favoriteButton}>
          <Button
            title={
              recipe.isFavorite
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
            }
            onPress={handleToggleFavorite}
          />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>

        {recipe.ingredients.map((ingredient) => (
          <Text key={ingredient.id} style={styles.itemText}>
            • {ingredient.name} — {ingredient.quantity} {ingredient.unit}
          </Text>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Modo de preparo</Text>

        {recipe.steps.map((step, index) => (
          <Text key={step.id} style={styles.itemText}>
            {index + 1}. {step.description}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },
  meta: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: "#333",
  },
  favoriteButton: {
    marginTop: 12,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});