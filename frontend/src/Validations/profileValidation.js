import * as yup from 'yup';

export const updateProfileSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters'),
  fullName: yup.string().required('Full name is required'),
  gender: yup.string().oneOf(['Male', 'Female'], 'Select gender'),
  dob: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'You must be at least 15 years old', function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 15;
    }),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10,11}$/, 'Invalid phone number'),
  bloodType: yup.string().required('Blood type is required'),
});
