import * as yup from 'yup';

export const playerValidationSchema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  date_of_birth: yup.date().required(),
  position: yup.string().required(),
  academy_id: yup.string().nullable().required(),
  parent_id: yup.string().nullable().required(),
});
