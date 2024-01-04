import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';

const SignInSchema = Yup.object().shape({
  login: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();
  const [debug, setDebug] = useState(false);
  const toggleDebug = () => {
    setDebug(!debug);
  };
  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/');
    }
  }, [auth.isLoggedIn, navigate]);
  return (
    <Box backgroundColor="gray.50" position="fixed" w="full" h="full">
      <Box
        w="375px"
        margin="2rem auto 0 auto"
        p={4}
        rounded="lg"
        backgroundColor="white"
        shadow="md"
      >
        <Formik
          initialValues={{ login: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { data } = await authService.login(values);
              auth.signIn(data);
            } catch (e) {
              toast({
                title: 'Sign in failed',
                description: 'Wrong email or password. Please try again.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              });
            }
            setSubmitting(false);
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
                    autoComplete="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.login}
                    isInvalid={
                      !!(errors.login && touched.login && errors.login)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Mật khẩu</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    isInvalid={
                      !!(errors.password && touched.password && errors.password)
                    }
                    backgroundColor="white"
                  />
                </FormControl>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                >
                  Đăng nhập
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
        <Button position="fixed" right="2" bottom="2" onClick={toggleDebug} />
      </Box>
    </Box>
  );
};

export default Login;
