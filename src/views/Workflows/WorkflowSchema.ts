import * as Yup from "yup";

export const WorkflowSchema = Yup.object().shape({
  title: Yup.string()
    .required("Required")
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .min(2, "must be at least 2 characters"),
  description: Yup.string().test(
    "no-only-spaces",
    "Description cannot be only spaces",
    (value) => {
      if (!value) return true; // Optional field, empty is allowed
      return value.trim().length > 0; // If provided, must have at least one non-space character
    }
  ),
});

