import * as Yup from "yup";

export const AgentSchema = Yup.object().shape({
  agentName: Yup.string()
    .required("Required")
    .min(2, "must be at least 2 characters")
    .max(100, "must not exceed 100 characters"),
  description: Yup.string(),
});
