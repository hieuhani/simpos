import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "../shared/contexts";
import { AuthProvider } from "../shared/contexts/AuthContext";
import { Main } from "./Main";
import { StatusBar } from "react-native";

export const App: React.FunctionComponent = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar barStyle="light-content" />
            <Main />
          </ThemeProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
