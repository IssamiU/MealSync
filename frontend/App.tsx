import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation";
import { store } from "./src/store";
import AuthBootstrap from "./src/components/AuthBootstrap";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthBootstrap>
          <StatusBar style="auto" />
          <AppNavigator />
        </AuthBootstrap>
      </SafeAreaProvider>
    </Provider>
  );
}