import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { toggleFavoriteRecipe } from "../../store/slices/recipesSlice";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecipesList">;

export default function RecipesListScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

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
            <Pressable
              onPress={() =>
                navigation.navigate("RecipeDetails", { recipeId: item.id })
              }
            >
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <Text style={styles.title}>{item.title}</Text>

                  <Pressable
                    onPress={() => dispatch(toggleFavoriteRecipe(item.id))}
                    style={styles.favoriteButton}
                  >
                    <Text style={styles.favoriteText}>
                      {item.isFavorite ? "★" : "☆"}
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.info}>Categoria: {item.category}</Text>
                <Text style={styles.info}>
                  Tempo de preparo: {item.prepTimeMinutes} min
                </Text>
                <Text style={styles.info}>Porções: {item.servings}</Text>
                <Text style={styles.info}>
                  Ingredientes: {item.ingredients.length}
                </Text>
                <Text style={styles.info}>Passos: {item.steps.length}</Text>
              </View>
            </Pressable>
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
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    marginRight: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});