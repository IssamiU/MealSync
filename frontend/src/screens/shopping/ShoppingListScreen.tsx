import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import {
  addShoppingListItem,
  clearShoppingList,
  removeShoppingListItem,
  setShoppingList,
  toggleShoppingListItem,
  updateShoppingListItem,
} from "../../store/slices/shoppingListSlice";
import { RootStackParamList } from "../../types/navigation";
import { ShoppingListItem } from "../../types/shopping";
import { generateShoppingListFromPlanner } from "../../utils/generateShoppingList";

type Props = NativeStackScreenProps<RootStackParamList, "ShoppingList">;

const initialFormState = {
  name: "",
  quantity: "",
  unit: "",
};

export default function ShoppingListScreen({ navigation }: Props) {
  const dispatch = useDispatch();

  const plannedMeals = useSelector(
    (state: RootState) => state.planner.plannedMeals
  );
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const shoppingItems = useSelector(
    (state: RootState) => state.shoppingList.items
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [name, setName] = useState(initialFormState.name);
  const [quantity, setQuantity] = useState(initialFormState.quantity);
  const [unit, setUnit] = useState(initialFormState.unit);

  const isEditing = useMemo(() => editingItemId !== null, [editingItemId]);

  function resetForm() {
    setName(initialFormState.name);
    setQuantity(initialFormState.quantity);
    setUnit(initialFormState.unit);
    setEditingItemId(null);
  }

  function openAddModal() {
    resetForm();
    setIsModalVisible(true);
  }

  function openEditModal(item: ShoppingListItem) {
    setEditingItemId(item.id);
    setName(item.name);
    setQuantity(String(item.quantity));
    setUnit(item.unit);
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
    resetForm();
  }

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

  function handleSaveItem() {
    if (!name.trim() || !quantity.trim() || !unit.trim()) {
      Alert.alert("Atenção", "Preencha nome, quantidade e unidade.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert("Atenção", "Informe uma quantidade válida maior que zero.");
      return;
    }

    if (isEditing && editingItemId) {
        const currentItem = shoppingItems.find((item) => item.id === editingItemId);

        dispatch(
            updateShoppingListItem({
            id: editingItemId,
            name: name.trim(),
            quantity: parsedQuantity,
            unit: unit.trim(),
            checked: currentItem?.checked ?? false,
            })
        );
        Alert.alert("Sucesso", "Item atualizado com sucesso.");
        } else {
      dispatch(
        addShoppingListItem({
          id: Date.now().toString(),
          name: name.trim(),
          quantity: parsedQuantity,
          unit: unit.trim(),
          checked: false,
        })
      );
      Alert.alert("Sucesso", "Item adicionado com sucesso.");
    }

    closeModal();
  }

  function handleRemoveItem(id: string) {
    Alert.alert("Remover item", "Deseja remover este item da lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => dispatch(removeShoppingListItem(id)),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <View style={styles.buttonSpacing}>
          <Button title="Gerar lista automaticamente" onPress={handleGenerateList} />
        </View>

        <View style={styles.buttonSpacing}>
          <Button title="Adicionar item manualmente" onPress={openAddModal} />
        </View>

        <View style={styles.buttonSpacing}>
          <Button title="Limpar lista" onPress={handleClearList} />
        </View>
      </View>

      {shoppingItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptyText}>
            Gere a lista com base no planejamento semanal ou adicione itens manualmente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={shoppingItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemCard,
                item.checked ? styles.itemCheckedCard : undefined,
              ]}
            >
              <Pressable
                style={styles.itemInfoArea}
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

              <View style={styles.itemButtons}>
                <Pressable
                  style={[styles.smallButton, styles.editButton]}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.smallButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={[styles.smallButton, styles.removeButton]}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.smallButtonText}>Remover</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footerSpacing}>
        <Button
          title="Voltar ao dashboard"
          onPress={() => navigation.navigate("Dashboard")}
        />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Editar item" : "Novo item"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do item"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TextInput
              style={styles.input}
              placeholder="Unidade"
              value={unit}
              onChangeText={setUnit}
            />

            <View style={styles.modalButtons}>
              <View style={styles.modalButtonSpacing}>
                <Button title="Salvar" onPress={handleSaveItem} />
              </View>

              <Button title="Cancelar" onPress={closeModal} color="#666" />
            </View>
          </View>
        </View>
      </Modal>
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
  itemInfoArea: {
    marginBottom: 12,
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
  itemButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  smallButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButton: {
    backgroundColor: "#1d4ed8",
  },
  removeButton: {
    backgroundColor: "#dc2626",
  },
  smallButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  modalButtons: {
    marginTop: 8,
  },
  modalButtonSpacing: {
    marginBottom: 10,
  },
});