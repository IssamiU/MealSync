import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { colors } from "../../theme/colors";

type NotifSetting = {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  iconBg: string;
};

const SETTINGS: NotifSetting[] = [
  { key: "mealReminders",   label: "Lembretes de refeição",    description: "Aviso antes de cada refeição planejada",     icon: "restaurant-outline",  iconColor: colors.primary,  iconBg: colors.primaryLight },
  { key: "prepReminders",   label: "Hora de preparar",         description: "Lembrete para começar a preparar a receita", icon: "time-outline",        iconColor: "#F59E0B",       iconBg: "#FEF3C7" },
  { key: "weeklyPlanning",  label: "Planejamento semanal",     description: "Lembre-se de planejar a semana toda segunda", icon: "calendar-outline",    iconColor: "#3B82F6",       iconBg: "#DBEAFE" },
  { key: "newFeatures",     label: "Novidades do app",         description: "Saiba quando novos recursos forem lançados",  icon: "sparkles-outline",    iconColor: "#8B5CF6",       iconBg: "#EDE9FE" },
];

export default function NotificationsScreen({ navigation }: any) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    mealReminders: true,
    prepReminders: true,
    weeklyPlanning: false,
    newFeatures: false,
  });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  React.useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setPermissionGranted(status === "granted");
    });
  }, []);

  async function requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionGranted(status === "granted");
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Ative as notificações nas configurações do seu celular para receber lembretes.");
    }
  }

  function toggle(key: string, value: boolean) {
    if (value && !permissionGranted) {
      requestPermission();
      return;
    }
    setEnabled((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Banner de permissão */}
        {permissionGranted === false && (
          <Pressable style={styles.permissionBanner} onPress={requestPermission}>
            <Ionicons name="notifications-off-outline" size={20} color="#B45309" />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Notificações desativadas</Text>
              <Text style={styles.permissionSub}>Toque para ativar nas configurações</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#B45309" />
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>LEMBRETES</Text>
        <View style={styles.card}>
          {SETTINGS.map((setting, index) => (
            <React.Fragment key={setting.key}>
              <View style={styles.settingRow}>
                <View style={[styles.settingIcon, { backgroundColor: setting.iconBg }]}>
                  <Ionicons name={setting.icon} size={18} color={setting.iconColor} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDesc}>{setting.description}</Text>
                </View>
                <Switch
                  value={enabled[setting.key] ?? false}
                  onValueChange={(v) => toggle(setting.key, v)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={enabled[setting.key] ? colors.primary : "#fff"}
                />
              </View>
              {index < SETTINGS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.hint}>
          Os lembretes de refeição são configurados individualmente em cada item do planejamento semanal.
        </Text>
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
  permissionBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", borderRadius: 14, padding: 14, marginBottom: 20, gap: 10, borderWidth: 1, borderColor: "#FDE68A" },
  permissionText: { flex: 1 },
  permissionTitle: { fontSize: 14, fontWeight: "700", color: "#92400E" },
  permissionSub: { fontSize: 12, color: "#B45309" },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: colors.textMuted, letterSpacing: 1, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  settingIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  settingText: { flex: 1, marginRight: 8 },
  settingLabel: { fontSize: 15, fontWeight: "600", color: colors.textPrimary, marginBottom: 2 },
  settingDesc: { fontSize: 12, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  hint: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginTop: 16, textAlign: "center" },
});