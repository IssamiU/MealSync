import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../../store";
import { colors } from "../../theme/colors";

export default function PersonalDataScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) { Alert.alert("Atenção", "O nome não pode estar vazio."); return; }
    if (newPassword && newPassword.length < 6) { Alert.alert("Atenção", "A nova senha deve ter pelo menos 6 caracteres."); return; }
    if (newPassword && newPassword !== confirmPassword) { Alert.alert("Atenção", "As senhas não coincidem."); return; }
    if (newPassword && !currentPassword) { Alert.alert("Atenção", "Digite a senha atual para alterá-la."); return; }

    setSaving(true);
    // TODO: chamar endpoint PUT /users/me quando implementado
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Sucesso", "Dados atualizados!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    }, 600);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Dados pessoais</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Seção dados básicos */}
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Nome completo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
            />
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </View>

          {/* Seção alterar senha */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>ALTERAR SENHA</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Senha atual</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Digite sua senha atual"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showCurrent}
                returnKeyType="next"
              />
              <Pressable onPress={() => setShowCurrent((v) => !v)} hitSlop={8}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Nova senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showNew}
                returnKeyType="next"
              />
              <Pressable onPress={() => setShowNew((v) => !v)} hitSlop={8}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Confirmar nova senha</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita a nova senha"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          <Pressable
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? "Salvando..." : "Salvar alterações"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 4 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.textMuted, marginTop: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { fontSize: 15, color: colors.textPrimary, paddingVertical: 8, paddingBottom: 10 },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 8, paddingBottom: 10 },
  divider: { height: 1, backgroundColor: colors.border },
  saveBtn: { marginTop: 32, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});