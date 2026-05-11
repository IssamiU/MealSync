import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";

import { signIn } from "../../store/slices/authSlice";
import { saveAuth } from "../../storage/authStorage";
import { API_URL } from "../../services/api";
import { colors } from "../../theme/colors";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

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
      console.log(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image
              source={require("../../../assets/images/compras.png")}
              style={styles.logo}
            />

            <Text style={styles.title}>MealSync</Text>

            <Text style={styles.subtitle}>
              Organize suas receitas, seu planejamento e sua lista de compras.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {/* RF29 — link para recuperação de senha */}
            <Pressable
              style={styles.forgotButton}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.secondaryButtonText}>Ir para cadastro</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 24 },
  card: { borderRadius: 20, padding: 24 },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 16, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 10, color: colors.textPrimary },
  subtitle: { fontSize: 15, textAlign: "center", color: colors.textSecondary, lineHeight: 22, marginBottom: 24 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: colors.textPrimary,
  },
  // RF29 — link esqueceu a senha
  forgotButton: { alignSelf: "flex-end", marginBottom: 16, marginTop: -4 },
  forgotButtonText: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 10 },
  primaryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  secondaryButton: { backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
});