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
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nenhuma receita cadastrada</Text>
          <Text style={styles.emptyText}>
            Cadastre uma receita para vê-la aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Text style={styles.favoriteText}>
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
                <Text style={styles.info}>Categoria: {item.category}</Text>
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
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
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
  },
  favoriteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  favoriteText: {
    fontSize: 28,
  },
  info: {
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },
  actionsRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 6,
  },
});