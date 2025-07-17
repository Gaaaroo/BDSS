import * as Yup from 'yup';

export const seekerFormSchema = Yup.object().shape({
  volume: Yup.string()
    .oneOf(['350', '400', '450'], 'Invalid volume')
    .required('Volume is required'),

  bloodType: Yup.string()
    .oneOf(
      ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'Invalid blood type'
    )
    .required('Blood type is required'),

  priority: Yup.string()
    .oneOf(['Urgent', 'Medium'], 'Invalid priority')
    .required('Priority is required'),

  type: Yup.string()
    .oneOf(
      ['Whole', 'RBC', 'Plasma', 'Platelets', 'WBCs'],
      'Invalid component type'
    )
    .required('Component type is required'),

  quantity: Yup.string()
    .oneOf(['1', '2', '3', '4'], 'Invalid quantity')
    .required('Quantity is required'),

  hospitalAddress: Yup.string()
    .required('Hospital address is required')
    .min(5, 'Hospital address must be at least 5 characters'),

  requiredDate: Yup.date()
    .required('Required date is required')
    .min(
      new Date().toISOString().split('T')[0],
      'Date must be today or in the future'
    ),
});
