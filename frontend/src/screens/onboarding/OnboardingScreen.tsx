import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { colors } from "../../theme/colors";

function Slide({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.slide}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

interface Props {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: Props) {
  return (
    <Onboarding
      onDone={onDone}
      onSkip={onDone}
      bottomBarHighlight={false}
      controlStatusBar={false}
      titleStyles={styles.hidden}
      subTitleStyles={styles.hidden}
      pages={[
        {
          backgroundColor: colors.background,
          image: (
            <Slide
              icon="🍽️"
              title="Bem-vindo ao MealSync"
              description="Organize suas receitas, planeje suas refeições e gere listas de compras automaticamente."
            />
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: colors.background,
          image: (
            <Slide
              icon="📅"
              title="Planejamento semanal"
              description="Monte seu cardápio da semana escolhendo receitas para cada dia e refeição."
            />
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: colors.background,
          image: (
            <Slide
              icon="🛒"
              title="Lista de compras"
              description="Gere sua lista automaticamente com base no planejamento semanal."
            />
          ),
          title: "",
          subtitle: "",
        },
        {
          backgroundColor: colors.background,
          image: (
            <Slide
              icon="🥦"
              title="O que tenho em casa?"
              description="Informe os ingredientes disponíveis e descubra quais receitas você já pode preparar agora."
            />
          ),
          title: "",
          subtitle: "",
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  slide: { alignItems: "center", paddingHorizontal: 32 },
  icon: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 26, fontWeight: "700", color: colors.textPrimary, textAlign: "center", marginBottom: 16 },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: "center", lineHeight: 24 },
  hidden: { height: 0, opacity: 0 },
});