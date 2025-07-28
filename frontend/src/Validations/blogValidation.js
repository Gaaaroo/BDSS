import * as yup from 'yup';

export const blogSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .max(150, 'Title must be less than 150 characters'),

  imageLink: yup
    .string()
    .url('Section image link must be a valid URL')
    .nullable()
    .notRequired(),

  sections: yup
    .array()
    .of(
      yup.object().shape({
        content: yup
          .string()
          .required('Section content is required')
          .max(1000, 'Section content must be less than 1000 characters'),
      })
    )
    .min(1, 'At least one section is required'),
});


