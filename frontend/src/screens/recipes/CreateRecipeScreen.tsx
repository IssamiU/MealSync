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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import { RootStackParamList } from "../../types/navigation";
import { addRecipe } from "../../store/slices/recipesSlice";
import { RecipeCategory } from "../../types/recipe";

type Props = NativeStackScreenProps<RootStackParamList, "CreateRecipe">;

type IngredientForm = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
};

type StepForm = {
  id: string;
  description: string;
};

export default function CreateRecipeScreen({ navigation }: Props) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("Outro");

  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { id: Date.now().toString(), name: "", quantity: "", unit: "" },
  ]);

  const [steps, setSteps] = useState<StepForm[]>([
    { id: Date.now().toString() + "-step", description: "" },
  ]);

  function handleIngredientChange(
    id: string,
    field: keyof IngredientForm,
    value: string
  ) {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  }

  function handleStepChange(id: string, value: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, description: value } : step
      )
    );
  }

  function addIngredientField() {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(),
        name: "",
        quantity: "",
        unit: "",
      },
    ]);
  }

  function removeIngredientField(id: string) {
    if (ingredients.length === 1) {
      Alert.alert("Atenção", "A receita precisa de pelo menos 1 ingrediente.");
      return;
    }

    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  }

  function addStepField() {
    setSteps((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(),
        description: "",
      },
    ]);
  }

  function removeStepField(id: string) {
    if (steps.length === 1) {
      Alert.alert("Atenção", "A receita precisa de pelo menos 1 passo.");
      return;
    }

    setSteps((prev) => prev.filter((step) => step.id !== id));
  }

  function handleSaveRecipe() {
    if (!title.trim() || !prepTimeMinutes.trim() || !servings.trim()) {
      Alert.alert(
        "Atenção",
        "Preencha título, tempo de preparo e número de porções."
      );
      return;
    }

    const validIngredients = ingredients.filter(
      (ingredient) =>
        ingredient.name.trim() &&
        ingredient.quantity.trim() &&
        ingredient.unit.trim()
    );

    const validSteps = steps.filter((step) => step.description.trim());

    if (validIngredients.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos 1 ingrediente válido.");
      return;
    }

    if (validSteps.length === 0) {
      Alert.alert("Atenção", "Adicione pelo menos 1 passo válido.");
      return;
    }

    dispatch(
      addRecipe({
        id: Date.now().toString(),
        title: title.trim(),
        ingredients: validIngredients.map((ingredient, index) => ({
          id: `${Date.now()}-ingredient-${index}`,
          name: ingredient.name.trim(),
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit.trim(),
        })),
        steps: validSteps.map((step, index) => ({
          id: `${Date.now()}-step-${index}`,
          description: step.description.trim(),
        })),
        prepTimeMinutes: Number(prepTimeMinutes),
        servings: Number(servings),
        category,
        imageUrl: "",
        isFavorite: false,
      })
    );

    Alert.alert("Sucesso", "Receita cadastrada com sucesso.");
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Informações básicas</Text>

      <TextInput
        style={styles.input}
        placeholder="Título da receita"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Tempo de preparo (minutos)"
        keyboardType="numeric"
        value={prepTimeMinutes}
        onChangeText={setPrepTimeMinutes}
      />

      <TextInput
        style={styles.input}
        placeholder="Número de porções"
        keyboardType="numeric"
        value={servings}
        onChangeText={setServings}
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
        >
          <Picker.Item label="Café da manhã" value="Café da manhã" />
          <Picker.Item label="Almoço" value="Almoço" />
          <Picker.Item label="Jantar" value="Jantar" />
          <Picker.Item label="Lanche" value="Lanche" />
          <Picker.Item label="Sobremesa" value="Sobremesa" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Ingredientes</Text>

      {ingredients.map((ingredient, index) => (
        <View key={ingredient.id} style={styles.block}>
          <Text style={styles.blockTitle}>Ingrediente {index + 1}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome do ingrediente"
            value={ingredient.name}
            onChangeText={(value) =>
              handleIngredientChange(ingredient.id, "name", value)
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={ingredient.quantity}
            onChangeText={(value) =>
              handleIngredientChange(ingredient.id, "quantity", value)
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Unidade (g, ml, un...)"
            value={ingredient.unit}
            onChangeText={(value) =>
              handleIngredientChange(ingredient.id, "unit", value)
            }
          />

          <Button
            title="Remover ingrediente"
            onPress={() => removeIngredientField(ingredient.id)}
          />
        </View>
      ))}

      <View style={styles.buttonSpacing}>
        <Button title="Adicionar ingrediente" onPress={addIngredientField} />
      </View>

      <Text style={styles.sectionTitle}>Modo de preparo</Text>

      {steps.map((step, index) => (
        <View key={step.id} style={styles.block}>
          <Text style={styles.blockTitle}>Passo {index + 1}</Text>

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Descreva o passo"
            multiline
            value={step.description}
            onChangeText={(value) => handleStepChange(step.id, value)}
          />

          <Button title="Remover passo" onPress={() => removeStepField(step.id)} />
        </View>
      ))}

      <View style={styles.buttonSpacing}>
        <Button title="Adicionar passo" onPress={addStepField} />
      </View>

      <View style={styles.saveButton}>
        <Button title="Salvar receita" onPress={handleSaveRecipe} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  block: {
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  buttonSpacing: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});