import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";
import { API_URL } from "../../services/api";
import { getAuth } from "../../storage/authStorage";
import { updateRecipe } from "../../store/slices/recipesSlice";
import { normalizeRecipe } from "../../utils/normalizeRecipe";
import { colors } from "../../theme/colors";

// Mesma lista do CreateRecipeScreen para consistência
const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "xícara",
  "colher de sopa",
  "colher de chá",
  "unidade",
  "dente",
  "pitada",
  "a gosto",
  "fatia",
  "folha",
  "ramo",
];

interface StepField {
  id: string;
  description: string;
  hasTimer: boolean;
}

interface IngredientField {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function EditRecipeScreen({ navigation, route }: any) {
  const { recipeId } = route.params;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState("Outro");
  const [ingredients, setIngredients] = useState<IngredientField[]>([]);
  const [steps, setSteps] = useState<StepField[]>([]);

  useEffect(() => {
    loadRecipe();
  }, []);

  async function loadRecipe() {
    try {
      const auth = await getAuth();
      if (!auth) return;

      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao carregar receita");

      setTitle(data.title ?? "");
      setPrepTimeMinutes(String(data.prepTimeMinutes ?? ""));
      setServings(String(data.servings ?? ""));
      setCategory(data.category ?? "Outro");
      setIngredients(
        (data.ingredients ?? []).map((i: any) => ({
          id: i.id ?? i._id ?? Date.now().toString() + Math.random(),
          name: i.name ?? "",
          quantity: i.quantity != null ? String(i.quantity) : "",
          // garante que unidades antigas (texto livre) caem na primeira opção da lista
          unit: UNITS.includes(i.unit) ? i.unit : UNITS[0],
        }))
      );
      setSteps(
        (data.steps ?? []).map((s: any) => ({
          id: s.id ?? s._id ?? Date.now().toString() + Math.random(),
          description: s.description ?? "",
          hasTimer: s.hasTimer ?? false,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar receita para edição:", error);
      Alert.alert("Erro", "Não foi possível carregar a receita.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleIngredientChange(id: string, field: string, value: string) {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), name: "", quantity: "", unit: UNITS[0] },
    ]);
  }

  function removeIngredient(id: string) {
    if (ingredients.length === 1) {
      Alert.alert("Atenção", "Precisa de pelo menos 1 ingrediente.");
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function handleStepChange(id: string, field: keyof StepField, value: any) {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), description: "", hasTimer: false },
    ]);
  }

  function removeStep(id: string) {
    if (steps.length === 1) {
      Alert.alert("Atenção", "Precisa de pelo menos 1 passo.");
      return;
    }
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    if (!title.trim() || !prepTimeMinutes || !servings) {
      Alert.alert("Atenção", "Preencha os campos principais.");
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name && i.quantity && i.unit);
    const validSteps = steps.filter((s) => s.description.trim());

    if (validIngredients.length === 0) {
      Alert.alert("Atenção", "Adicione ingredientes válidos.");
      return;
    }
    if (validSteps.length === 0) {
      Alert.alert("Atenção", "Adicione passos válidos.");
      return;
    }

    try {
      setSaving(true);
      const auth = await getAuth();
      if (!auth) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        return;
      }

      const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          prepTimeMinutes: Number(prepTimeMinutes),
          servings: Number(servings),
          ingredients: validIngredients.map((i, index) => ({
            id: i.id ?? `${Date.now()}-ingredient-${index}`,
            name: i.name,
            quantity: Number(i.quantity),
            unit: i.unit,
          })),
          steps: validSteps.map((s, index) => ({
            id: s.id ?? `${Date.now()}-step-${index}`,
            description: s.description,
            hasTimer: s.hasTimer,
            duration: null,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Erro ao atualizar receita:", data);
        throw new Error(data.message || "Erro ao salvar receita");
      }

      dispatch(updateRecipe(normalizeRecipe(data)));

      Alert.alert("Sucesso", "Receita atualizada!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Erro handleSave:", error);
      Alert.alert("Erro", error.message || "Erro ao salvar receita.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando receita...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Editar receita</Text>
          <Text style={styles.subtitle}>Altere os dados e salve para atualizar.</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Tempo de preparo (min)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={prepTimeMinutes}
          onChangeText={setPrepTimeMinutes}
          returnKeyType="next"
        />
        <TextInput
          style={styles.input}
          placeholder="Porções"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={servings}
          onChangeText={setServings}
          returnKeyType="done"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            <Picker.Item label="Café da manhã" value="Café da manhã" />
            <Picker.Item label="Almoço" value="Almoço" />
            <Picker.Item label="Jantar" value="Jantar" />
            <Picker.Item label="Lanche" value="Lanche" />
            <Picker.Item label="Sobremesa" value="Sobremesa" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Ingredientes</Text>

        {ingredients.map((item, index) => (
          <View key={item.id} style={styles.block}>
            <Text style={styles.blockTitle}>Ingrediente {index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              value={item.name}
              onChangeText={(v) => handleIngredientChange(item.id, "name", v)}
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={item.quantity}
              onChangeText={(v) => handleIngredientChange(item.id, "quantity", v)}
              returnKeyType="done"
            />

            <Text style={styles.label}>Unidade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.unit}
                onValueChange={(v) => handleIngredientChange(item.id, "unit", v)}
              >
                {UNITS.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
            </View>

            <Pressable
              style={styles.removeInlineButton}
              onPress={() => removeIngredient(item.id)}
            >
              <Text style={styles.removeInlineButtonText}>Remover ingrediente</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.secondaryActionButton} onPress={addIngredient}>
          <Text style={styles.secondaryActionButtonText}>+ Adicionar ingrediente</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Modo de preparo</Text>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.block}>
            <Text style={styles.blockTitle}>Passo {index + 1}</Text>

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Descrição do passo"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={step.description}
              onChangeText={(v) => handleStepChange(step.id, "description", v)}
            />

            <View style={styles.timerToggleRow}>
              <View style={styles.timerToggleLeft}>
                <Text style={styles.timerToggleLabel}>⏱ Tem timer?</Text>
                <Text style={styles.timerToggleHint}>
                  O tempo será definido na hora de cozinhar
                </Text>
              </View>
              <Switch
                value={step.hasTimer}
                onValueChange={(v) => handleStepChange(step.id, "hasTimer", v)}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={step.hasTimer ? colors.primary : colors.textSecondary}
              />
            </View>

            <Pressable
              style={styles.removeInlineButton}
              onPress={() => removeStep(step.id)}
            >
              <Text style={styles.removeInlineButtonText}>Remover passo</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.secondaryActionButton} onPress={addStep}>
          <Text style={styles.secondaryActionButtonText}>+ Adicionar passo</Text>
        </Pressable>

        <Pressable
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Text>
        </Pressable>

        <View style={{ height: 48 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  container: { padding: 24, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background, gap: 16 },
  loadingText: { fontSize: 15, color: colors.textSecondary },
  headerCard: { borderRadius: 18, padding: 18, marginBottom: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 6, color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, textAlign: "center" },
  label: { fontWeight: "700", marginBottom: 8, color: colors.textPrimary, fontSize: 15 },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, marginBottom: 12, color: colors.textPrimary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  multiline: { minHeight: 120, textAlignVertical: "top" },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  block: { borderRadius: 14, padding: 14, marginBottom: 14, backgroundColor: colors.surfaceAlt },
  blockTitle: { fontWeight: "700", marginBottom: 10, color: colors.textPrimary, fontSize: 16 },
  timerToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 4,
  },
  timerToggleLeft: { flex: 1, marginRight: 12 },
  timerToggleLabel: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 2 },
  timerToggleHint: { fontSize: 12, color: colors.textSecondary },
  removeInlineButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  removeInlineButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryActionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    marginBottom: 8,
  },
  secondaryActionButtonText: { color: colors.primary, fontSize: 16, fontWeight: "700" },
  saveButton: { marginTop: 22, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});