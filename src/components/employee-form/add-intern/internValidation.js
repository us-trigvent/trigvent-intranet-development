import * as yup from "yup";

const emailSchema = (label, required = false) => {
  const schema = yup.string().email(`Enter a valid ${label}.`);
  return required
    ? schema.required(`${label[0].toUpperCase()}${label.slice(1)} is required.`)
    : schema;
};

const currentYear = new Date().getFullYear();
const optionalYearSchema = yup
  .string()
  .matches(/^\d{4}$/, {
    message: "Enter a valid year.",
    excludeEmptyString: true,
  })
  .test(
    "year-range",
    "Enter a valid year.",
    (value) =>
      !value ||
      (Number(value) >= 1950 && Number(value) <= currentYear + 10)
  );

const contactDetailsSchema = yup.object({
  firstName: yup.string().trim().required("First name is required."),
  dob: yup.string().required("Date of birth is required."),
  gender: yup.string().required("Gender is required."),
  mobile: yup.string().trim().required("Mobile number is required."),
  alternateNumber: yup
    .string()
    .trim()
    .required("Alternate number is required."),
  officialEmail: emailSchema("official email"),
  personalEmail: emailSchema("personal email", true),
  department: yup.string().required("Department is required."),
  designation: yup.string().required("Designation is required."),
  joiningDate: yup.string().required("Joining date is required."),
  workType: yup.string().required("Work type is required."),
  branch: yup.string().required("Branch is required."),
  employeeCode: yup.string().trim().required("Intern code is required."),
});

const loginDetailsSchema = yup.object({
  loginEmail: emailSchema("login email", true),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must contain at least 8 characters."),
});

const internDetailsSchema = yup.object({
  college: yup.string().trim().required("College is required."),
  qualification: yup.string().trim().required("Qualification is required."),
  pursuingYear: optionalYearSchema,
  passoutYear: optionalYearSchema,
});

const bankDetailsSchema = yup.object({
  aadhaarNumber: yup
    .string()
    .required("Aadhaar number is required.")
    .matches(/^\d{12}$/, "Enter a valid 12-digit Aadhaar number."),
  panNumber: yup
    .string()
    .required("PAN number is required.")
    .matches(/^[A-Z]{5}\d{4}[A-Z]$/i, "Enter a valid PAN format."),
});

const notesSchema = yup.object({
  notes: yup.array().of(yup.string()),
});

export const internStepSchemas = [
  contactDetailsSchema,
  loginDetailsSchema,
  internDetailsSchema,
  bankDetailsSchema,
  notesSchema,
];

export const internStepFields = internStepSchemas.map((schema) =>
  Object.keys(schema.fields)
);

export const internValidationSchema = internStepSchemas.reduce(
  (schema, stepSchema) => schema.concat(stepSchema),
  yup.object()
);

export async function getInternStepErrors(step, values) {
  try {
    await internStepSchemas[step].validate(values, { abortEarly: false });
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
