import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_URL } from "../../services/api";
import { normalizeRecipe } from "../../utils/normalizeRecipe";
import { colors } from "../../theme/colors";

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
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaBadge}>
          <Text style={styles.metaBadgeText}>{recipe.category}</Text>
        </View>

        <Text style={styles.meta}>
          Tempo de preparo: {recipe.prepTimeMinutes} min
        </Text>
        <Text style={styles.meta}>Porções: {recipe.servings}</Text>
        <Text style={styles.meta}>
          Favorita: {recipe.isFavorite ? "Sim" : "Não"}
        </Text>

        <Pressable
          style={[
            styles.favoriteButton,
            recipe.isFavorite
              ? styles.favoriteButtonActive
              : styles.favoriteButtonDefault,
          ]}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {recipe.isFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>

        {recipe.ingredients.map((ingredient: any) => (
          <View key={ingredient.id} style={styles.listItem}>
            <Text style={styles.itemBullet}>•</Text>
            <Text style={styles.itemText}>
              {ingredient.name} — {ingredient.quantity} {ingredient.unit}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Modo de preparo</Text>

        {recipe.steps.map((step: any, index: number) => (
          <View key={step.id} style={styles.listItem}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>
            <Text style={styles.itemText}>{step.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: colors.border,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  metaBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderWidth: 0,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  metaBadgeText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },
  meta: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: colors.textPrimary,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  itemBullet: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 8,
    lineHeight: 24,
    fontWeight: "700",
  },
  stepNumber: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    lineHeight: 22,
    fontWeight: "700",
    minWidth: 22,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  favoriteButton: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  favoriteButtonDefault: {
    backgroundColor: colors.primary,
  },
  favoriteButtonActive: {
    backgroundColor: colors.danger,
  },
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingCard: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 28,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});