import React, { useMemo, useState } from "react";
import {
  Alert,
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
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const isEditing = useMemo(() => editingItemId !== null, [editingItemId]);

  function resetForm() {
    setName("");
    setQuantity("");
    setUnit("");
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

    const generatedItems = generateShoppingListFromPlanner(
      plannedMeals,
      recipes
    );

    dispatch(setShoppingList(generatedItems));
    Alert.alert("Sucesso", "Lista gerada com sucesso.");
  }

  function handleClearList() {
    if (shoppingItems.length === 0) {
      Alert.alert("Atenção", "A lista já está vazia.");
      return;
    }

    Alert.alert("Limpar lista", "Deseja remover todos os itens da lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        style: "destructive",
        onPress: () => dispatch(clearShoppingList()),
      },
    ]);
  }

  function handleSaveItem() {
    const parsedQuantity = Number(quantity);

    if (!name || !quantity || !unit || parsedQuantity <= 0) {
      Alert.alert("Erro", "Preencha corretamente.");
      return;
    }

    if (isEditing && editingItemId) {
      const currentItem = shoppingItems.find((i) => i.id === editingItemId);

      dispatch(
        updateShoppingListItem({
          id: editingItemId,
          name,
          quantity: parsedQuantity,
          unit,
          checked: currentItem?.checked ?? false,
        })
      );

      Alert.alert("Sucesso", "Item atualizado.");
    } else {
      dispatch(
        addShoppingListItem({
          id: Date.now().toString(),
          name,
          quantity: parsedQuantity,
          unit,
          checked: false,
        })
      );

      Alert.alert("Sucesso", "Item adicionado.");
    }

    closeModal();
  }

  function handleRemoveItem(id: string) {
    Alert.alert("Remover", "Deseja remover este item?", [
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
      <Text style={styles.title}>Lista de compras</Text>
      <Text style={styles.subtitle}>
        Gere sua lista com base no planejamento ou adicione itens manualmente.
      </Text>

      <Text style={styles.sectionTitle}>Ações rápidas</Text>

      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionCard} onPress={handleGenerateList}>
          <Text style={styles.actionTitle}>Gerar lista automaticamente</Text>
          <Text style={styles.actionDescription}>
            Usa o planejamento semanal para montar a lista de compras.
          </Text>
        </Pressable>

        <Pressable style={styles.actionCard} onPress={openAddModal}>
          <Text style={styles.actionTitle}>Adicionar item manualmente</Text>
          <Text style={styles.actionDescription}>
            Inclua um item avulso que não veio do planejamento.
          </Text>
        </Pressable>

        <Pressable style={styles.actionCard} onPress={handleClearList}>
          <Text style={styles.actionTitle}>Limpar lista</Text>
          <Text style={styles.actionDescription}>
            Remove todos os itens atuais da sua lista de compras.
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Itens</Text>

      {shoppingItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Lista vazia</Text>
          <Text style={styles.emptyText}>
            Gere a lista ou adicione itens manualmente.
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
                styles.card,
                item.checked ? styles.checkedCard : undefined,
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

              <View style={styles.buttonsRow}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.buttonText}>Remover</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Editar item" : "Novo item"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
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

            <Pressable style={styles.modalPrimaryButton} onPress={handleSaveItem}>
              <Text style={styles.modalPrimaryButtonText}>Salvar</Text>
            </Pressable>

            <Pressable style={styles.modalSecondaryButton} onPress={closeModal}>
              <Text style={styles.modalSecondaryButtonText}>Cancelar</Text>
            </Pressable>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  actionDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  checkedCard: {
    opacity: 0.6,
  },
  itemInfoArea: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111827",
  },
  itemInfo: {
    color: "#444",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  emptyText: {
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalPrimaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  modalPrimaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  modalSecondaryButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalSecondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 15,
  },
});