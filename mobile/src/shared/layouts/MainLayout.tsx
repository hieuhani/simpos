import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";

import { NavigationBar } from "../components/NavigationBar";

export type WithNavigationProps = StackScreenProps<any>;

export interface MainLayoutProps extends WithNavigationProps {
  children: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export const MainLayout: React.FunctionComponent<MainLayoutProps> = ({
  children,
  ...props
}: MainLayoutProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar {...props} />
      {children}
    </SafeAreaView>
  );
};

export function withMainLayout<
  T extends WithNavigationProps = WithNavigationProps
>(WrappedComponent: React.ComponentType<T>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  const ComponentWithTheme = (props: T) => {
    return (
      <MainLayout navigation={props.navigation} route={props.route}>
        <WrappedComponent {...(props as T)} />
      </MainLayout>
    );
  };

  ComponentWithTheme.displayName = `withMainLayout(${displayName})`;

  return ComponentWithTheme;
}
