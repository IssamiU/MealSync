import React from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import {
  clearShoppingList,
  setShoppingList,
  toggleShoppingListItem,
} from "../../store/slices/shoppingListSlice";
import { RootStackParamList } from "../../types/navigation";
import { generateShoppingListFromPlanner } from "../../utils/generateShoppingList";

type Props = NativeStackScreenProps<RootStackParamList, "ShoppingList">;

export default function ShoppingListScreen({ navigation }: Props) {
  const dispatch = useDispatch();

  const plannedMeals = useSelector(
    (state: RootState) => state.planner.plannedMeals
  );
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const shoppingItems = useSelector(
    (state: RootState) => state.shoppingList.items
  );

  function handleGenerateList() {
    if (plannedMeals.length === 0) {
      Alert.alert(
        "Atenção",
        "Adicione receitas ao planejamento semanal antes de gerar a lista."
      );
      return;
    }

    const generatedItems = generateShoppingListFromPlanner(plannedMeals, recipes);

    dispatch(setShoppingList(generatedItems));
    Alert.alert("Sucesso", "Lista de compras gerada com sucesso.");
  }

  function handleClearList() {
    dispatch(clearShoppingList());
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <View style={styles.buttonSpacing}>
          <Button title="Gerar lista automaticamente" onPress={handleGenerateList} />
        </View>

        <View style={styles.buttonSpacing}>
          <Button title="Limpar lista" onPress={handleClearList} />
        </View>
      </View>

      {shoppingItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptyText}>
            Gere a lista com base no planejamento semanal.
          </Text>
        </View>
      ) : (
        <FlatList
          data={shoppingItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.itemCard,
                item.checked ? styles.itemCheckedCard : undefined,
              ]}
              onPress={() => dispatch(toggleShoppingListItem(item.id))}
            >
              <Text style={styles.itemTitle}>
                {item.checked ? "✓ " : "○ "}
                {item.name}
              </Text>
              <Text style={styles.itemInfo}>
                {item.quantity} {item.unit}
              </Text>
            </Pressable>
          )}
        />
      )}

      <View style={styles.footerSpacing}>
        <Button
          title="Voltar ao dashboard"
          onPress={() => navigation.navigate("Dashboard")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  actions: {
    marginBottom: 12,
  },
  buttonSpacing: {
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 12,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemCheckedCard: {
    opacity: 0.65,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  itemInfo: {
    fontSize: 15,
    color: "#444",
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
  footerSpacing: {
    marginTop: 8,
  },
});