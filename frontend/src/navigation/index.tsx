import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import CreateRecipeScreen from "../screens/recipes/CreateRecipeScreen";
import RecipesListScreen from "../screens/recipes/RecipesListScreen";
import RecipeDetailsScreen from "../screens/recipes/RecipeDetailsScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Entrar" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Cadastro" }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "Comprinhas" }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}