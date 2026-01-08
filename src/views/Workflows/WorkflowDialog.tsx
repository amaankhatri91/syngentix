import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog } from "@/components/Dialog";
import { FormikInput } from "@/components/FormikInput";
import { FormikTextarea } from "@/components/FormikTextarea";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import { WorkflowFormValues } from "./types";
import { WorkflowSchema } from "./WorkflowSchema";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setWorkflowDialog,
  createWorkflow,
  editWorkflow,
} from "@/store/workflow/workflowSlice";
import { useParams, useNavigate } from "react-router-dom";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const WorkflowDialog = () => {
  const { isDark } = useTheme();

  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { workflowDialog, workflowRow } = useAppSelector(
    (state) => state.workflow
  );
  const dispatch = useAppDispatch();
  const { invalidateAllQueries } = useRefetchQueries();
  const handleCancel = (resetForm?: () => void) => {
    dispatch(
      setWorkflowDialog({
        workflowDialog: false,
        workflowRow: {},
      })
    );
    if (resetForm) {
      resetForm();
    }
  };
  return (
    <Dialog
      open={workflowDialog}
      handler={handleCancel}
      title={`${workflowRow?.id ? "Edit" : "Create"} New Workflow`}
      size='sm'
      bodyClassName="!px-8 !pb-5"
    >
      <div className="mb-4">
        <p className={`text-md text-center`}>
          Set up a new automated workflow for your agent
        </p>
      </div>
      <Formik<WorkflowFormValues>
        initialValues={{
          title: workflowRow?.title || workflowRow?.name || "",
          description: workflowRow?.description || "",
        }}
        validationSchema={WorkflowSchema}
        onSubmit={async (values: WorkflowFormValues) => {
          try {
            const response: any = workflowRow?.workflow_id
              ? await dispatch(
                  editWorkflow({
                    id: workflowRow?.workflow_id,
                    title: values.title,
                    description: values.description,
                  })
                ).unwrap()
              : await dispatch(
                  createWorkflow({
                    ...values,
                    agentId: agentId,
                  })
                ).unwrap();
            if (response?.data?.status === "success") {
              showSuccessToast(
                response?.data?.message ||
                  `Workflow ${
                    workflowRow?.workflow_id ? "updated" : "created"
                  } successfully`
              );

              // If creating a new workflow, redirect to editor
              if (
                !workflowRow?.workflow_id &&
                response?.data?.data?.workflow_id
              ) {
                const newWorkflowId = response.data.data.workflow_id;
                const newWorkflowTitle =
                  response.data.data.title || values.title;
                dispatch(
                  setWorkflowDialog({
                    workflowDialog: false,
                    workflowRow: {},
                  })
                );
                // Navigate to workflow editor
                navigate(`/agent/${agentId}/workflow/${newWorkflowId}`, {
                  state: {
                    workflowTitle: newWorkflowTitle,
                  },
                });
              } else {
                // For edit, just close the dialog
                dispatch(
                  setWorkflowDialog({
                    workflowDialog: false,
                    workflowRow: {},
                  })
                );
              }
            } else {
              showErrorToast(
                response?.data?.message ||
                  `Failed to ${
                    workflowRow?.workflow_id ? "update" : "create"
                  } workflow. Please try again.`
              );
            }
            invalidateAllQueries();
          } catch (error: any) {
            // Show error toast with error message
            const errorMessage =
              error?.message ||
              error?.response?.data?.message ||
              error?.data?.message ||
              `Failed to ${
                workflowRow?.workflow_id ? "update" : "create"
              } workflow. Please try again.`;
            showErrorToast(errorMessage);
            console.error(error, "Verify Error");
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
                  Workflow Name <span className="text-red-500">*</span>
                </h5>
                <Field name="title">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      id="title"
                      placeholder="Please enter workflow name"
                      className={`
                        !min-w-0
                      `}
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
              <div className="space-y-1">
                <h5 className="text-sm 2xl:text-[16px] font-medium">
                  Description
                </h5>
                <Field name="description">
                  {({ field }: any) => (
                    <FormikTextarea
                      field={field}
                      id="description"
                      placeholder="Please provide a brief description of the workflow"
                      rows={5}
                      className={`
                        !min-w-0 
                      `}
                      errors={errors}
                      touched={touched}
                      onFieldTouched={() =>
                        setFieldTouched("description", true)
                      }
                      onFieldChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement>
                      ) => {
                        setFieldValue("description", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[17px]">
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>
            </div>
            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              cancelText="Cancel"
              submitText={`${workflowRow?.id ? "Edit" : "Create"} Workflow`}
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !dirty}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default WorkflowDialog;
