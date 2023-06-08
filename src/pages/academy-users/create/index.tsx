import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createAcademyUser } from 'apiSdk/academy-users';
import { Error } from 'components/error';
import { academyUserValidationSchema } from 'validationSchema/academy-users';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { AcademyInterface } from 'interfaces/academy';
import { UserInterface } from 'interfaces/user';
import { getAcademies } from 'apiSdk/academies';
import { getUsers } from 'apiSdk/users';
import { AcademyUserInterface } from 'interfaces/academy-user';

function AcademyUserCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AcademyUserInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAcademyUser(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AcademyUserInterface>({
    initialValues: {
      academy_id: (router.query.academy_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: academyUserValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Academy User
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<AcademyInterface>
            formik={formik}
            name={'academy_id'}
            label={'Select Academy'}
            placeholder={'Select Academy'}
            fetcher={getAcademies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'academy_user',
  operation: AccessOperationEnum.CREATE,
})(AcademyUserCreatePage);
