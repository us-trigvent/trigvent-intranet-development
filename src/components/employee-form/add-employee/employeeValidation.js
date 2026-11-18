import * as yup from "yup";

const emailSchema = (label, required = false) => {
  const schema = yup.string().email(`Enter a valid ${label}.`);
  return required
    ? schema.required(`${label[0].toUpperCase()}${label.slice(1)} is required.`)
    : schema;
};

const personalDetailsSchema = yup.object({
  firstName: yup.string().trim().required("First name is required."),
  dob: yup
    .string()
    .required("Date of birth is required.")
    .test(
      "minimum-age",
      "Employee must be at least 15 years old.",
      (value) => {
        if (!value) return true;
        const minimumDob = new Date();
        minimumDob.setFullYear(minimumDob.getFullYear() - 15);
        return new Date(value) <= minimumDob;
      }
    ),
  gender: yup.string().trim().required("Gender is required."),
  mobile: yup
    .string()
    .required("Mobile number is required.")
    .matches(/^\d{10,15}$/, "Enter a valid 10-15 digit mobile number."),
  alternateNumber: yup
    .string()
    .required("Alternate number is required.")
    .matches(
      /^\d{10,15}$/,
      "Enter a valid 10-15 digit alternate number."
    ),
  officialEmail: emailSchema("official email address"),
  personalEmail: emailSchema("personal email", true),
  department: yup
    .string()
    .required("Department is required.")
    .matches(/^\d+$/, "Enter a valid department ID."),
  designation: yup
    .string()
    .required("Designation is required.")
    .matches(/^\d+$/, "Enter a valid designation ID."),
  joiningDate: yup
    .string()
    .required("Joining date is required.")
    .test(
      "after-date-of-birth",
      "Joining date must be after date of birth.",
      function (value) {
        if (!value || !this.parent.dob) return true;
        return new Date(value) > new Date(this.parent.dob);
      }
    ),
  workType: yup.string().trim().required("Work type is required."),
  branch: yup.string().trim().required("Branch is required."),
  attendanceCode: yup
    .string()
    .matches(/^\d{1,10}$/, {
      message: "Attendance code must be at most 10 digits.",
      excludeEmptyString: true,
    }),
  cardNumber: yup
    .string()
    .required("Card number is required.")
    .matches(/^\d{1,10}$/, "Card number must be at most 10 digits."),
  profileImage: yup
    .mixed()
    .nullable()
    .test(
      "image-type",
      "Choose a JPEG, PNG, or WebP image.",
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
    .test(
      "image-size",
      "Image must be 2048 KB or smaller.",
      (file) => !file || file.size <= 2048 * 1024
    ),
});

const loginDetailsSchema = yup.object({
  loginEmail: emailSchema("login email", true),
  password: yup
    .string()
    .test(
      "password-length",
      "Password must contain at least 8 characters.",
      (value) => !value || value.length >= 8
    ),
});

const bankDetailsSchema = yup.object({
  aadhaarNumber: yup
    .string()
    .required("Aadhaar number is required.")
    .matches(/^\d{12}$/, "Enter a valid 12-digit Aadhaar number."),
  panNumber: yup
    .string()
    .required("PAN number is required.")
    .matches(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a valid PAN format."),
  ifscCode: yup
    .string()
    .max(11, "IFSC code must be at most 11 characters."),
  accountNumber: yup
    .string()
    .max(20, "Account number must be at most 20 characters."),
});

const notesDetailsSchema = yup.object({
  college: yup.string().max(150, "College must be 150 characters or fewer."),
  qualification: yup
    .string()
    .max(100, "Qualification must be 100 characters or fewer."),
  passoutYear: yup
    .string()
    .matches(/^\d{4}$/, {
      message: "Enter a 4-digit year.",
      excludeEmptyString: true,
    }),
  pursuingYear: yup
    .string()
    .matches(/^\d{4}$/, {
      message: "Enter a 4-digit year.",
      excludeEmptyString: true,
    }),
  interviewDate: yup.string().test(
    "valid-interview-date",
    "Enter a valid interview date.",
    (value) => !value || !Number.isNaN(new Date(value).getTime())
  ),
});

export const employeeStepSchemas = [
  personalDetailsSchema,
  loginDetailsSchema,
  bankDetailsSchema,
  notesDetailsSchema,
];

export const employeeValidationSchema = employeeStepSchemas
  .reduce((schema, stepSchema) => schema.concat(stepSchema), yup.object())
  .shape({ notes: yup.array().of(yup.string()) });

export async function getValidationErrors(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) throw error;

    return error.inner.reduce((errors, issue) => {
      if (issue.path && !errors[issue.path]) {
        errors[issue.path] = issue.message;
      }
      return errors;
    }, {});
  }
}
