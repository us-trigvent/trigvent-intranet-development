import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email address is required."),

  password: Yup.string()
    .required("Password is required."),
});

export const changePasswordValidationSchema = Yup.object({
  oldPassword: Yup.string()
    .required("Old password is required."),

  password: Yup.string()
    .min(8, "New password must be at least 8 characters.")
    .notOneOf([Yup.ref("oldPassword")], "New password must be different from the old password.")
    .required("New password is required."),

  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "New password and confirmation do not match.")
    .required("Password confirmation is required."),
});