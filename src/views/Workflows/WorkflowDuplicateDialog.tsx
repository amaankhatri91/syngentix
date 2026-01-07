import React, { useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import { Dialog } from "@/components/Dialog";
import { FormikInput } from "@/components/FormikInput";
import { FormikSelect, SelectOption } from "@/components/FormikSelect";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import { DuplicateWorkflowSchema } from "./WorkflowDuplicateSchema";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setDuplicateWorkflowDialog,
  duplicateWorkflow,
} from "@/store/workflow/workflowSlice";
import { useGetAgentsQuery } from "@/services/RtkQueryService";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface DuplicateWorkflowFormValues {
  agentId: string;
  title: string;
}

const WorkflowDuplicateDialog = () => {
  const { isDark } = useTheme();
  const { agentId } = useParams<{ agentId: string }>();
  const { duplicateWorkflowDialog, duplicateWorkflowRow } = useAppSelector(
    (state) => state.workflow
  );
  const { workspace, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { invalidateAllQueries } = useRefetchQueries();

  // Fetch agents for the dropdown
  const { data: agentsData } = useGetAgentsQuery(workspace?.id, {
    skip: !token || !workspace?.id,
  });

  // Convert agents to select options
  const agentOptions: SelectOption[] = useMemo(() => {
    if (!agentsData?.data) return [];
    return agentsData.data.map((agent) => ({
      value: agent.agent_id || agent.id,
      label: agent.name,
    }));
  }, [agentsData]);

  const handleCancel = (resetForm?: () => void) => {
    dispatch(
      setDuplicateWorkflowDialog({
        duplicateWorkflowDialog: false,
        duplicateWorkflowRow: {},
      })
    );
    if (resetForm) {
      resetForm();
    }
  };

  return (
    <Dialog
      open={duplicateWorkflowDialog}
      handler={handleCancel}
      title="Duplicate Workflow"
      size="xs"
      bodyClassName="!px-8 !pb-5"
    >
      <div className="mb-4">
        <p className={`text-md text-center`}>
          Select an agent and enter a title for the duplicated workflow.
        </p>
      </div>
      <Formik<DuplicateWorkflowFormValues>
        initialValues={{
          agentId: "",
          title: "",
        }}
        validationSchema={DuplicateWorkflowSchema}
        onSubmit={async (values: DuplicateWorkflowFormValues) => {
          try {
            const workflowId =
              duplicateWorkflowRow?.workflow_id || duplicateWorkflowRow?.id;
            if (!workflowId) {
              showErrorToast("Workflow ID is missing");
              return;
            }
            if (!values.agentId) {
              showErrorToast("Please select a target agent");
              return;
            }
            const response: any = await dispatch(
              duplicateWorkflow({
                sourceAgentId: agentId,
                workflowId: workflowId,
                targetAgentId: values.agentId,
                workflowTitle: values.title,
              })
            ).unwrap();
            if (response?.data?.status === "success") {
              showSuccessToast(
                response?.data?.message || "Workflow duplicated successfully"
              );
              dispatch(
                setDuplicateWorkflowDialog({
                  duplicateWorkflowDialog: false,
                  duplicateWorkflowRow: {},
                })
              );
              invalidateAllQueries();
            } else {
              showErrorToast(
                response?.data?.message ||
                  "Failed to duplicate workflow. Please try again."
              );
            }
          } catch (error: any) {
            const errorMessage =
              error?.message ||
              error?.response?.data?.message ||
              error?.data?.message ||
              "Failed to duplicate workflow. Please try again.";
            showErrorToast(errorMessage);
            console.error(error, "Duplicate Workflow Error");
          }
        }}
        enableReinitialize
      >
        {({
          resetForm,
          isSubmitting,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          dirty,
        }) => (
          <Form>
            <div>
              <div className="space-y-1">
                <h5 className="text-sm 2xl:text-[16px] font-medium">
                  Select Agent <span className="text-red-500">*</span>
                </h5>
                <Field name="agentId">
                  {({ field }: any) => (
                    <FormikSelect
                      field={field}
                      options={agentOptions}
                      placeholder="Please Select"
                      className={`!min-w-0`}
                      errors={errors}
                      touched={touched}
                      menuPortalTarget={document.body}
                      onFieldTouched={() => setFieldTouched("agentId", true)}
                      onFieldChange={(option: SelectOption | null) => {
                        setFieldValue("agentId", option ? option.value : "");
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[17px]">
                  <ErrorMessage
                    name="agentId"
                    component="div"
                    className="text-red-500 text-xs 2xl:text-sm mt-1"
                  />
                </div>
              </div>
              <div className="space-y-1 ">
                <h5 className="text-sm 2xl:text-[16px] font-medium">Title</h5>
                <Field name="title">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      id="title"
                      placeholder="Please enter workflow title"
                      className={`!min-w-0`}
                      errors={errors}
                      touched={touched}
                      onFieldTouched={() => setFieldTouched("title", true)}
                      onFieldChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue("title", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[17px]">
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-xs 2xl:text-sm mt-1"
                  />
                </div>
              </div>
            </div>
            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              cancelText="Cancel"
              submitText="Duplicate Workflow"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !dirty}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default WorkflowDuplicateDialog;
