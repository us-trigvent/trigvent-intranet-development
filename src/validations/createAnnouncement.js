import * as Yup from "yup";

export const createAnnouncementValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required."),

  content: Yup.string()
    .test(
      "content-required",
      "Description is required.",
      (value) => {
        const plainContent = (value || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .trim();

        return plainContent.length > 0;
      }
    )
    .required("Description is required."),

  date: Yup.string()
    .required("Date is required."),
});