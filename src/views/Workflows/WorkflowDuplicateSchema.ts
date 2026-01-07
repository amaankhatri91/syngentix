import * as Yup from "yup";

export const DuplicateWorkflowSchema = Yup.object().shape({
  agentId: Yup.string().required("Agent selection is required"),
  title: Yup.string(),
});
