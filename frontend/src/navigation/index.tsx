import React from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import CreateRecipeScreen from "../screens/recipes/CreateRecipeScreen";
import RecipesListScreen from "../screens/recipes/RecipesListScreen";
import RecipeDetailsScreen from "../screens/recipes/RecipeDetailsScreen";
import PlannerScreen from "../screens/planner/PlannerScreen";
import ShoppingListScreen from "../screens/shopping/ShoppingListScreen";

import { RootStackParamList } from "../types/navigation";
import { RootState } from "../store";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/compras.png")}
                style={styles.logo}
              />
              <Text style={styles.headerText}>MealSync</Text>
            </View>
          ),
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerBackVisible: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Cadastro" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ headerBackVisible: false }}
            />
            <Stack.Screen
              name="CreateRecipe"
              component={CreateRecipeScreen}
              options={{ title: "Nova receita" }}
            />
            <Stack.Screen
              name="RecipesList"
              component={RecipesListScreen}
              options={{ title: "Receitas" }}
            />
            <Stack.Screen
              name="RecipeDetails"
              component={RecipeDetailsScreen}
              options={{ title: "Detalhes da receita" }}
            />
            <Stack.Screen
              name="Planner"
              component={PlannerScreen}
              options={{ title: "Planejamento semanal" }}
            />
            <Stack.Screen
              name="ShoppingList"
              component={ShoppingListScreen}
              options={{ title: "Lista de compras" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});