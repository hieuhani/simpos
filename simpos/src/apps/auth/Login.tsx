import React from 'react';
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  login: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login: React.FunctionComponent = () => {
  return (
    <Box w="375px" margin="0 auto">
      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="login">
                <FormLabel>Email</FormLabel>
                <Input
                  name="login"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.login}
                  isInvalid={!!(errors.login && touched.login && errors.login)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mat khau</FormLabel>
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  isInvalid={
                    !!(errors.password && touched.password && errors.password)
                  }
                />
              </FormControl>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                isLoading={isSubmitting}
              >
                Dang nhap
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};
