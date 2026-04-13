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

  function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha nome, e-mail e senha.");
      return;
    }

    dispatch(
      signIn({
        id: Date.now().toString(),
        name,
        email,
        preferences: {
          vegetarian,
          glutenFree,
          lactoseFree,
        },
      })
    );

    Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
    navigation.replace("Dashboard");
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