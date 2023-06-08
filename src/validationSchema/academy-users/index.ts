import * as yup from 'yup';

export const academyUserValidationSchema = yup.object().shape({
  academy_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
