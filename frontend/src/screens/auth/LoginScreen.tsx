import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import { saveAuth } from "../../storage/authStorage";
import { RootStackParamList } from "../../types/navigation";
import { signIn } from "../../store/slices/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      const response = await fetch("http://192.168.15.8:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log("LOGIN STATUS:", response.status);
      console.log("LOGIN DATA:", data);

      if (!response.ok) {
        Alert.alert("Erro", data.message || "Erro ao fazer login");
        return;
      }

      const authData = {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      await saveAuth(authData);
      dispatch(signIn(authData));

    } catch (error) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>APP COMPRINHAS</Text>

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
        <Button title="Entrar" onPress={handleLogin} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Ir para cadastro"
          onPress={() => navigation.navigate("Register")}
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
    fontSize: 28,
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