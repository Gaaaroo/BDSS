// src/validators/userValidation.js
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
    .min(5, 'Password must be at least 5 characters')
    .required('Please enter your password'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please re-enter the same password to confirm'),
});
