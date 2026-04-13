import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../services/api";

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

  // -------- INGREDIENTES --------
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

  // -------- PASSOS --------
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

  // -------- SALVAR --------
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Receita</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Tempo de preparo (min)"
        keyboardType="numeric"
        value={prepTimeMinutes}
        onChangeText={setPrepTimeMinutes}
      />

      <TextInput
        style={styles.input}
        placeholder="Porções"
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
            value={item.name}
            onChangeText={(v) =>
              handleIngredientChange(item.id, "name", v)
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={item.quantity}
            onChangeText={(v) =>
              handleIngredientChange(item.id, "quantity", v)
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Unidade"
            value={item.unit}
            onChangeText={(v) =>
              handleIngredientChange(item.id, "unit", v)
            }
          />

          <Button
            title="Remover ingrediente"
            onPress={() => removeIngredient(item.id)}
          />
        </View>
      ))}

      <Button title="Adicionar ingrediente" onPress={addIngredient} />

      <Text style={styles.sectionTitle}>Modo de preparo</Text>

      {steps.map((step, index) => (
        <View key={step.id} style={styles.block}>
          <Text style={styles.blockTitle}>Passo {index + 1}</Text>

          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Descrição"
            multiline
            value={step.description}
            onChangeText={(v) => handleStepChange(step.id, v)}
          />

          <Button
            title="Remover passo"
            onPress={() => removeStep(step.id)}
          />
        </View>
      ))}

      <Button title="Adicionar passo" onPress={addStep} />

      <View style={styles.saveButton}>
        <Button title="Salvar Receita" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  block: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  blockTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
  },
});