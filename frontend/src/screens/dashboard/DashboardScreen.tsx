import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { signOut } from "../../store/slices/authSlice";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  function handleLogout() {
    dispatch(signOut());
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo semanal</Text>
      <Text style={styles.subtitle}>
        Olá, {user?.name ?? "usuário"}!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Receitas planejadas</Text>
        <Text>0 receitas cadastradas no planejamento</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lista de compras</Text>
        <Text>0 itens na lista</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dica</Text>
        <Text>Aproveite ingredientes que já estão na geladeira.</Text>
      </View>

      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});