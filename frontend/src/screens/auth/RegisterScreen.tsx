import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import { RootStackParamList } from "../../types/navigation";
import { signIn } from "../../store/slices/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vegetarian, setVegetarian] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [lactoseFree, setLactoseFree] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://192.168.15.8:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          preferences: {
            vegetarian,
            glutenFree,
            lactoseFree,
          },
        }),
      });

      const data = await response.json();

      console.log("REGISTER STATUS:", response.status);
      console.log("REGISTER DATA:", data);

      if (!response.ok) {
        Alert.alert("Erro", data.message || "Erro ao cadastrar");
        return;
      }

      dispatch(
        signIn({
          ...data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      navigation.replace("Dashboard");
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.preferenceRow}>
        <Text>Vegetariano</Text>
        <Switch value={vegetarian} onValueChange={setVegetarian} />
      </View>

      <View style={styles.preferenceRow}>
        <Text>Sem glúten</Text>
        <Switch value={glutenFree} onValueChange={setGlutenFree} />
      </View>

      <View style={styles.preferenceRow}>
        <Text>Sem lactose</Text>
        <Switch value={lactoseFree} onValueChange={setLactoseFree} />
      </View>

      <Button title="Cadastrar" onPress={handleRegister} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});