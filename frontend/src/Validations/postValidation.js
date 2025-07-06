import * as yup from 'yup';

export const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required('Please enter content.')
    .max(100, 'Comment must be less than 100 characters.'),
});
