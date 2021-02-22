import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  Select,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';

const SignInSchema = Yup.object().shape({
  tenant: Yup.string().required('Required'),
  login: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login: React.FunctionComponent = () => {
  const toast = useToast();
  const auth = useAuth();
  const history = useHistory();
  const [debug, setDebug] = useState(false);
  const toggleDebug = () => {
    setDebug(!debug);
  };
  useEffect(() => {
    if (auth.isLoggedIn) {
      history.push('/');
    }
  }, [auth.isLoggedIn, history]);
  return (
    <Box
      w="375px"
      margin="2rem auto 0 auto"
      backgroundColor="gray.50"
      p={4}
      rounded="md"
    >
      <Heading
        textAlign="center"
        mt={2}
        mb={6}
        fontSize="2xl"
        fontWeight="medium"
      >
        HỆ THỐNG CHAPOS
      </Heading>
      <Formik
        initialValues={{ tenant: '', login: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { data } = await authService.login(values);
            auth.signIn(data);
          } catch (e) {
            toast({
              title: 'Đăng nhập không thành công',
              description: 'Thông tin tài khoản hoặc mật khẩu không chính xác',
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
              <FormControl id="tenant">
                <FormLabel>Cửa hàng</FormLabel>
                {debug ? (
                  <Input
                    placeholder="Điền mã cửa hàng"
                    name="tenant"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tenant}
                    isInvalid={
                      !!(errors.tenant && touched.tenant && errors.tenant)
                    }
                    backgroundColor="white"
                  />
                ) : (
                  <Select
                    placeholder="Chọn cửa hàng"
                    name="tenant"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tenant}
                    autoCapitalize="off"
                    autoComplete="off"
                    isInvalid={
                      !!(errors.tenant && touched.tenant && errors.tenant)
                    }
                    backgroundColor="white"
                  >
                    <option value="chateraise">Chateraise</option>
                    <option value="baumkuchen">Baumkuchen</option>
                  </Select>
                )}
              </FormControl>
              <FormControl id="login">
                <FormLabel>Email</FormLabel>
                <Input
                  name="login"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.login}
                  isInvalid={!!(errors.login && touched.login && errors.login)}
                  backgroundColor="white"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mật khẩu</FormLabel>
                <Input
                  type="password"
                  name="password"
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
  );
};

export default Login;
