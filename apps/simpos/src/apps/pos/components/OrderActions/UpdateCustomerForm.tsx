import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { Partner, partnerRepository } from '../../../../services/db';
import { partnerService } from '../../../../services/partner';

const NewCustomerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  phone: Yup.string(),
  street: Yup.string(),
});

interface Props {
  onClose: (newCustomer: Partner | undefined) => void;
}
export const UpdateCustomerForm: React.FunctionComponent<Props> = ({
  onClose,
}) => {
  const toast = useToast();
  return (
    <Box borderRadius="md" bgColor="gray.100" py={4} px={4} mb={2}>
      <Formik
        initialValues={{ name: '', phone: '', street: '' }}
        validationSchema={NewCustomerSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const id = await partnerService.createPartners([values]);
            const partner: Partner = {
              id,
              ...values,
            };
            await partnerRepository.addPartner(partner);
            toast({
              title: 'Create customer successfully',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            onClose(partner);
          } catch (e) {
            toast({
              title: 'Create customer failed',
              status: 'error',
              duration: 5000,
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
              <FormControl id="name">
                <FormLabel>Customer name</FormLabel>
                <Input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  isInvalid={!!(errors.name && touched.name && errors.name)}
                  backgroundColor="white"
                />
              </FormControl>
              <FormControl id="phone">
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  isInvalid={!!(errors.phone && touched.phone && errors.phone)}
                  backgroundColor="white"
                />
              </FormControl>
              <FormControl id="street">
                <FormLabel>Address</FormLabel>
                <Input
                  name="street"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.street}
                  isInvalid={
                    !!(errors.street && touched.street && errors.street)
                  }
                  backgroundColor="white"
                />
              </FormControl>

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                isLoading={isSubmitting}
                colorScheme="red"
              >
                Add customer
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};
