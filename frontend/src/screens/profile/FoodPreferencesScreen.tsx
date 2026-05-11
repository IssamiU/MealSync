import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../../store";
import { colors } from "../../theme/colors";

type Preference = {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
};

const PREFERENCES: Preference[] = [
  { key: "vegetarian",  label: "Vegetariano",   description: "Sem carnes de qualquer tipo",      icon: "🥦", color: "#16A34A", bg: "#DCFCE7" },
  { key: "vegan",       label: "Vegano",         description: "Sem produtos de origem animal",    icon: "🌱", color: "#15803D", bg: "#F0FDF4" },
  { key: "glutenFree",  label: "Sem glúten",     description: "Restrição a trigo, centeio e cevada", icon: "🌾", color: "#B45309", bg: "#FEF3C7" },
  { key: "lactoseFree", label: "Sem lactose",    description: "Restrição a leite e derivados",   icon: "🥛", color: "#1D4ED8", bg: "#DBEAFE" },
  { key: "lowCarb",     label: "Low Carb",       description: "Baixo consumo de carboidratos",   icon: "🥩", color: "#DC2626", bg: "#FEE2E2" },
  { key: "sugarFree",   label: "Sem açúcar",     description: "Evita açúcares adicionados",      icon: "🚫", color: "#7C3AED", bg: "#EDE9FE" },
];

export default function FoodPreferencesScreen({ navigation }: any) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    // TODO: chamar endpoint PUT /users/me/preferences quando implementado
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Sucesso", "Preferências atualizadas!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    }, 600);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Preferências alimentares</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Selecione suas restrições e preferências. Elas podem ser usadas para filtrar receitas.
        </Text>

        {PREFERENCES.map((pref) => {
          const active = selected.has(pref.key);
          return (
            <Pressable
              key={pref.key}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => toggle(pref.key)}
            >
              <View style={[styles.iconBox, { backgroundColor: pref.bg }]}>
                <Text style={styles.iconText}>{pref.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, active && { color: colors.primary }]}>{pref.label}</Text>
                <Text style={styles.cardDesc}>{pref.description}</Text>
              </View>
              <View style={[styles.checkbox, active && styles.checkboxActive]}>
                {active && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? "Salvando..." : "Salvar preferências"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.textPrimary },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 20 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: colors.border },
  cardActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  iconText: { fontSize: 22 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 15, fontWeight: "700", color: colors.textPrimary, marginBottom: 2 },
  cardDesc: { fontSize: 12, color: colors.textSecondary },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  saveBtn: { marginTop: 24, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});