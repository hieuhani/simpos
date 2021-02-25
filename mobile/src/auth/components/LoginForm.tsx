import React from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

const styles = StyleSheet.create({
  formWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 36,
    paddingBottom: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  signInButton: {
    marginTop: 40,
  },
});

const SignInSchema = Yup.object().shape({
  login: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

export interface LogInPayload {
  login: string;
  password: string;
}
export interface LoginFormProps {
  onSignIn: (payload: LogInPayload) => void;
}

export const LoginForm: React.FunctionComponent<LoginFormProps> = ({
  onSignIn,
}) => {
  return (
    <Formik
      initialValues={{ login: "", password: "" }}
      validationSchema={SignInSchema}
      onSubmit={onSignIn}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isSubmitting,
        isValid,
      }) => (
        <View style={styles.formWrapper}>
          <Input
            label="Email"
            onChangeText={handleChange("login")}
            onBlur={handleBlur("login")}
            value={values.login}
          />
          <Input
            label="Password"
            secureTextEntry
            placeholder="Password"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          <Button
            onPress={handleSubmit}
            block
            style={styles.signInButton}
            disabled={isSubmitting || !isValid}
          >
            Đăng nhập
          </Button>
        </View>
      )}
    </Formik>
  );
};
