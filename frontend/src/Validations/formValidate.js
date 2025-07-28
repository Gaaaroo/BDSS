import * as yup from 'yup';

export const seekerFormSchema = yup.object().shape({
  bloodType: yup
    .string()
    .required('Kindly choose the blood type you are looking for'),
  volume: yup.string().required('Please choose a suitable volume (ml)'),
  priority: yup.string().required('Please choose a priority level'),
  hospitalAddress: yup
    .string()
    .required('Could you provide the hospital address?'),
  type: yup
    .string()
    .required('Please let us know which component type you need'),
  quantity: yup.string().required('Please select the quantity'),
  requiredDate: yup
    .string()
    .required('Please specify the required date')
    .test('is-future', 'The required date must be in the future', (value) => {
      if (!value) return false;
      const selected = new Date(value);
      return selected > new Date();
    }),
});

export const donorFormSchema = yup.object().shape({
  readyDate: yup
    .string()
    .required('Please specify the ready date')
    .test('is-future', 'The ready date must be in the future', (value) => {
      if (!value) return false;
      const selected = new Date(value);
      return selected > new Date();
    }),
  disease: yup
    .string()
    .required('Please specify disease or write "None"')
    .max(100, 'Disease description is too long'),
});
