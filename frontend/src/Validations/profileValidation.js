import * as yup from 'yup';

export const updateProfileSchema = yup.object({
  username: yup.string().trim().required('Username is required'),

  password: yup
    .string()
    .trim()
    .min(5, 'Password must be at least 5 characters')
    .notRequired(), // Optional

  fullName: yup.string().trim().required('Full name is required'),

  gender: yup
    .string()
    .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
    .required('Gender is required'),

  dob: yup
    .date()
    .required('Date of birth is required')
    .typeError('Invalid date'),

  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),

  bloodType: yup
    .string()
    .oneOf(
      ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      'Invalid blood type'
    )
    .required('Blood type is required'),
});
