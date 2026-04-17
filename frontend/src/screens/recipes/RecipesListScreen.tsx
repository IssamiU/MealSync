import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { setRecipes, updateRecipe } from "../../store/slices/recipesSlice";
import { normalizeRecipe } from "../../utils/normalizeRecipe";
import { API_URL } from "../../services/api";
import { colors } from "../../theme/colors";

export default function RecipesListScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const loadRecipes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar receitas");
      }

      dispatch(setRecipes(data.map(normalizeRecipe)));
    } catch (error) {
      console.log("Erro ao carregar receitas:", error);
      Alert.alert("Erro", "Erro ao carregar receitas");
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [loadRecipes])
  );

  async function toggleFavorite(id: string) {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}/favorite`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar favorito");
      }

      dispatch(updateRecipe(normalizeRecipe(data)));
    } catch (error) {
      console.log("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Erro ao atualizar favorito");
    }
  }

  function handleDelete(id: string) {
    Alert.alert("Excluir receita", "Deseja excluir esta receita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/recipes/${id}`, {
              method: "DELETE",
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
              throw new Error(data.message || "Erro ao excluir receita");
            }

            await loadRecipes();
            Alert.alert("Sucesso", "Receita excluída");
          } catch (error) {
            console.log("Erro ao excluir receita:", error);
            Alert.alert("Erro", "Erro ao excluir receita");
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {recipes.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma receita cadastrada</Text>
            <Text style={styles.emptyText}>
              Cadastre uma receita para vê-la aqui.
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.headerCard}>
              <Text style={styles.screenTitle}>Receitas cadastradas</Text>
              <Text style={styles.screenSubtitle}>
                Consulte, favorite e gerencie suas receitas salvas.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Pressable
                  style={styles.titleArea}
                  onPress={() =>
                    navigation.navigate("RecipeDetails", {
                      recipeId: item.id,
                    })
                  }
                >
                  <Text style={styles.title}>{item.title}</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.favoriteButton,
                    item.isFavorite && styles.favoriteButtonActive,
                  ]}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Text
                    style={[
                      styles.favoriteText,
                      item.isFavorite && styles.favoriteTextActive,
                    ]}
                  >
                    {item.isFavorite ? "★" : "☆"}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate("RecipeDetails", {
                    recipeId: item.id,
                  })
                }
              >
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>

                <Text style={styles.info}>
                  Tempo: {item.prepTimeMinutes} min
                </Text>
                <Text style={styles.info}>Porções: {item.servings}</Text>
                <Text style={styles.info}>
                  Ingredientes: {item.ingredients.length}
                </Text>
                <Text style={styles.info}>Passos: {item.steps.length}</Text>
              </Pressable>

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 0,
    borderColor: colors.border,
    justifyContent: "space-between",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  titleArea: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  favoriteButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 0,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  favoriteText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  favoriteTextActive: {
    color: colors.primaryDark,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderWidth: 0,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
    marginTop: 2,
  },
  categoryBadgeText: {
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },
  info: {
    fontSize: 15,
    marginBottom: 6,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionsRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  emptyCard: {
    width: "100%",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});