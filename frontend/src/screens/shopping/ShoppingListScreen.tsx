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
import { colors } from "../../theme/colors";

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
      <FlatList
        style={styles.list}
        data={shoppingItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <Text style={styles.title}>Lista de compras</Text>
              <Text style={styles.subtitle}>
                Gere sua lista com base no planejamento ou adicione itens
                manualmente.
              </Text>
            </View>

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

            {shoppingItems.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>Lista vazia</Text>
                <Text style={styles.emptyText}>
                  Gere a lista ou adicione itens manualmente.
                </Text>
              </View>
            )}
          </>
        }
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
        ListEmptyComponent={null}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Editar item" : "Novo item"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TextInput
              style={styles.input}
              placeholder="Unidade"
              placeholderTextColor={colors.textSecondary}
              value={unit}
              onChangeText={setUnit}
            />

            <Pressable
              style={styles.modalPrimaryButton}
              onPress={handleSaveItem}
            >
              <Text style={styles.modalPrimaryButtonText}>Salvar</Text>
            </Pressable>

            <Pressable
              style={styles.modalSecondaryButton}
              onPress={closeModal}
            >
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
    backgroundColor: colors.background,
    padding: 20,
  },
  headerCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 0,
    borderColor: colors.border,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center"

  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: colors.border,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: colors.border,
  },
  checkedCard: {
    opacity: 0.65,
  },
  itemInfoArea: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  itemInfo: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  removeButton: {
    backgroundColor: colors.danger,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 0,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: colors.textPrimary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(59, 47, 47, 0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  modalPrimaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalSecondaryButtonText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});