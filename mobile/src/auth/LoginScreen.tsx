import React, { useCallback } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  StatusBar,
  ToastAndroid,
} from "react-native";
import { useAuth } from "../shared/contexts/AuthContext";
import { LoginForm, LogInPayload } from "./components/LoginForm";
import { authService } from "../services/auth";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "#2B0C1B",
    opacity: 0.68,
  },
  bodyWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    backgroundColor: "#9C1B50",
    width: "90%",
    minWidth: 300,
    borderRadius: 36,
  },
  logoImage: {
    marginBottom: 10,
  },
  header: {
    padding: 30,
    alignItems: "center",
  },
  intro: {
    color: "#FFF",
    fontSize: 15,
  },
});

export const LoginScreen: React.FunctionComponent = () => {
  const auth = useAuth();
  const onSignIn = useCallback(
    async (payload: LogInPayload) => {
      try {
        const { data } = await authService.login(payload);
        auth.signIn(data);
      } catch (e) {
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    },
    [auth]
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image style={styles.background} source={require("../assets/cake.png")} />
      <View style={[styles.overlay, StyleSheet.absoluteFill]} />
      <View style={[styles.bodyWrapper, StyleSheet.absoluteFill]}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Image
              style={styles.logoImage}
              source={require("../assets/logo.png")}
            />
            <Text style={styles.intro}>Patisseria from Japan</Text>
          </View>
          <LoginForm onSignIn={onSignIn} />
        </View>
      </View>
    </View>
  );
};
