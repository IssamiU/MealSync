import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../services/api";
import { colors } from "../../theme/colors";

export default function CreateRecipeScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState("Outro");

  const [ingredients, setIngredients] = useState([
    { id: Date.now().toString(), name: "", quantity: "", unit: "" },
  ]);

  const [steps, setSteps] = useState([
    { id: Date.now().toString() + "-step", description: "" },
  ]);

  function handleIngredientChange(id: string, field: string, value: string) {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        name: "",
        quantity: "",
        unit: "",
      },
    ]);
  }

  function removeIngredient(id: string) {
    if (ingredients.length === 1) {
      Alert.alert("Atenção", "Precisa de pelo menos 1 ingrediente.");
      return;
    }

    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function handleStepChange(id: string, value: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, description: value } : step
      )
    );
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        description: "",
      },
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

    const validIngredients = ingredients.filter(
      (i) => i.name && i.quantity && i.unit
    );

    const validSteps = steps.filter((s) => s.description);

    if (validIngredients.length === 0) {
      Alert.alert("Atenção", "Adicione ingredientes válidos.");
      return;
    }

    if (validSteps.length === 0) {
      Alert.alert("Atenção", "Adicione passos válidos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          prepTimeMinutes: Number(prepTimeMinutes),
          servings: Number(servings),
          ingredients: validIngredients.map((i, index) => ({
            id: `${Date.now()}-ingredient-${index}`,
            name: i.name,
            quantity: Number(i.quantity),
            unit: i.unit,
          })),
          steps: validSteps.map((s, index) => ({
            id: `${Date.now()}-step-${index}`,
            description: s.description,
          })),
          imageUrl: "",
          userId: "123",
        }),
      });

      if (!response.ok) throw new Error();

      Alert.alert("Sucesso", "Receita criada!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao salvar receita.");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={styles.keyboardContainer}
        contentContainerStyle={styles.container}
        enableOnAndroid
        extraScrollHeight={200}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Nova Receita</Text>
          <Text style={styles.subtitle}>
            Preencha os detalhes para criar sua receita personalizada.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Tempo de preparo (min)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={prepTimeMinutes}
          onChangeText={setPrepTimeMinutes}
        />

        <TextInput
          style={styles.input}
          placeholder="Porções"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={servings}
          onChangeText={setServings}
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
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={item.quantity}
              onChangeText={(v) =>
                handleIngredientChange(item.id, "quantity", v)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Unidade"
              placeholderTextColor={colors.textSecondary}
              value={item.unit}
              onChangeText={(v) => handleIngredientChange(item.id, "unit", v)}
            />

            <Pressable
              style={styles.removeInlineButton}
              onPress={() => removeIngredient(item.id)}
            >
              <Text style={styles.removeInlineButtonText}>
                Remover ingrediente
              </Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.secondaryActionButton} onPress={addIngredient}>
          <Text style={styles.secondaryActionButtonText}>
            Adicionar ingrediente
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Modo de preparo</Text>

        {steps.map((step, index) => (
          <View key={step.id} style={styles.block}>
            <Text style={styles.blockTitle}>Passo {index + 1}</Text>

            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="Descrição"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={step.description}
              onChangeText={(v) => handleStepChange(step.id, v)}
            />

            <Pressable
              style={styles.removeInlineButton}
              onPress={() => removeStep(step.id)}
            >
              <Text style={styles.removeInlineButtonText}>Remover passo</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.secondaryActionButton} onPress={addStep}>
          <Text style={styles.secondaryActionButtonText}>Adicionar passo</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Receita</Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 0,
    borderColor: colors.border,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
    color: colors.textPrimary,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  block: {
    borderWidth: 0,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    backgroundColor: colors.surfaceAlt,
  },
  blockTitle: {
    fontWeight: "700",
    marginBottom: 10,
    color: colors.textPrimary,
    fontSize: 16,
  },
  removeInlineButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  removeInlineButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryActionButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  secondaryActionButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  saveButton: {
    marginTop: 22,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});