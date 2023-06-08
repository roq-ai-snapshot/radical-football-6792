import * as yup from 'yup';
import { academyUserValidationSchema } from 'validationSchema/academy-users';
import { playerValidationSchema } from 'validationSchema/players';

export const academyValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  academy_user: yup.array().of(academyUserValidationSchema),
  player: yup.array().of(playerValidationSchema),
});
