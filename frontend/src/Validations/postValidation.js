import * as yup from 'yup';

export const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required('Please enter comment.')
    .max(50, 'Comment must be less than 250 characters.'),
});

export const postSchema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: yup
    .string()
    .required('Content is required')
    .max(250, 'Content must be less than 250 characters')
    .min(50, 'Content must be at least 50 characters'),
});
