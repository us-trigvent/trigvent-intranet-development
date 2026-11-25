
import * as Yup from "yup";

export const deviceValidationSchema = Yup.object({
  category: Yup.string()
    .required("Please select a category."),

  serialNumber: Yup.string()
    .trim()
    .required("Serial number is required."),

  deviceCode: Yup.string()
    .trim()
    .nullable(),

  brand: Yup.string()
    .trim()
    .required("Brand is required."),

  condition: Yup.string()
    .oneOf(["Working", "Faulted"])
    .required("Please select a condition."),

  issued: Yup.string()
    .oneOf(["Yes", "No"])
    .required("Please select issue status."),

  issuedTo: Yup.string()
    .when("issued", {
      is: "Yes",
      then: (schema) =>
        schema.required("Please select an employee."),
      otherwise: (schema) => schema.notRequired(),
    }),

  issuedOn: Yup.string()
    .when("issued", {
      is: "Yes",
      then: (schema) =>
        schema.required("Please select issue date."),
      otherwise: (schema) => schema.notRequired(),
    }),

  remarks: Yup.string().trim().nullable(),

  comments: Yup.string().trim().nullable(),
});
