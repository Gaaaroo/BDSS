import * as yup from 'yup';

//Login validation schema
export const loginSchema = yup.object({
  username: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter your password'),
});

//Registration validation schema
export const registerSchema = yup.object({
  username: yup.string().required('Please enter your username'),

  email: yup
    .string()
    .email('Invalid email format')
    .required('Please enter your email'),

  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Please enter your phone number'),

  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter your password'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please re-enter the same password to confirm'),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .required('Please enter a new password')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});
