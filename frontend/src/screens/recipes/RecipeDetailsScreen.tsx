import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../../services/api";
import { normalizeRecipe } from "../../utils/normalizeRecipe";

export default function RecipeDetailsScreen({ route }: any) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    loadRecipe();
  }, []);

  async function loadRecipe() {
    try {
      const response = await fetch(`${API_URL}/recipes/${recipeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar receita");
      }

      setRecipe(normalizeRecipe(data));
    } catch (error) {
      console.log("Erro ao carregar receita:", error);
      Alert.alert("Erro", "Erro ao carregar receita");
    }
  }

  async function toggleFavorite() {
    try {
      const response = await fetch(`${API_URL}/recipes/${recipeId}/favorite`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Resposta de erro ao favoritar no detalhe:", data);
        throw new Error(data.message || "Erro ao atualizar favorito");
      }

      const updated = normalizeRecipe(data);
      setRecipe(updated);

      Alert.alert(
        "Favoritos",
        updated.isFavorite
          ? "Receita adicionada aos favoritos."
          : "Receita removida dos favoritos."
      );
    } catch (error) {
      console.log("Erro ao atualizar favorito no detalhe:", error);
      Alert.alert("Erro", "Erro ao atualizar favorito");
    }
  }

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
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
            onPress={toggleFavorite}
          />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>

        {recipe.ingredients.map((ingredient: any) => (
          <Text key={ingredient.id} style={styles.itemText}>
            • {ingredient.name} — {ingredient.quantity} {ingredient.unit}
          </Text>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Modo de preparo</Text>

        {recipe.steps.map((step: any, index: number) => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});