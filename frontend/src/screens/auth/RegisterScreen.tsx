import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_URL } from "../../services/api";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        Alert.alert("Erro", data?.message || "Erro ao cadastrar");
        return;
      }

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={handleRegister} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Voltar para login"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
});