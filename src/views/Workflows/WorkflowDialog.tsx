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
      size="sm"
      bodyClassName="!px-8 !pb-5"
    >
      <div className="mb-4">
        <p className={`text-md text-center`}>
          Set up a new automated workflow for your agent
        </p>
      </div>
      <Formik<WorkflowFormValues>
        initialValues={{
          title: (workflowRow?.title || workflowRow?.name || "").trim(),
          description: (workflowRow?.description || "").trim(),
        }}
        validationSchema={WorkflowSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values: WorkflowFormValues) => {
          try {
            // Trim values before submission to ensure no leading/trailing spaces
            const trimmedValues = {
              title: values.title.trim(),
              description: values.description.trim(),
            };

            const response: any = workflowRow?.workflow_id
              ? await dispatch(
                  editWorkflow({
                    id: workflowRow?.workflow_id,
                    title: trimmedValues.title,
                    description: trimmedValues.description,
                  })
                ).unwrap()
              : await dispatch(
                  createWorkflow({
                    ...trimmedValues,
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
                  response.data.data.title || trimmedValues.title;
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
                    workflowDescription: trimmedValues.description,
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
            console.log(error , "Verify Error")
            // Show error toast with error message
            const errorMessage =
              error?.message ||
              error?.response?.data?.message ||
              error?.data?.message ||
              `Failed to ${
                workflowRow?.workflow_id ? "update" : "create"
              } workflow. Please try again.`;
            showErrorToast('You’re offline. Check your internet connection.');
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
          values,
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
                  {({ field }: any) => {
                    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const newValue = e.target.value;
                      
                      // Remove any leading spaces
                      const trimmedValue = newValue.trimStart();
                      if (trimmedValue !== newValue) {
                        // If leading spaces were removed, update with trimmed value
                        setFieldValue("title", trimmedValue, false);
                      } else {
                        // No leading spaces, allow the change
                        field.onChange(e);
                      }
                      setFieldTouched("title", true);
                    };

                    const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
                      // Trim trailing spaces on blur
                      const trimmedValue = e.target.value.trimEnd();
                      if (trimmedValue !== e.target.value) {
                        setFieldValue("title", trimmedValue, false);
                      }
                      field.onBlur(e);
                      setFieldTouched("title", true);
                    };

                    return (
                      <FormikInput
                        field={{
                          ...field,
                          onChange: handleTitleChange,
                          onBlur: handleTitleBlur,
                        }}
                        type="text"
                        id="title"
                        placeholder="Please enter workflow name"
                        maxLength={100}
                        className={`
                          !min-w-0
                        `}
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("title", true)}
                      />
                    );
                  }}
                </Field>
                <div className="flex justify-between items-start min-h-[17px]">
                  <div className="flex-1">
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-xs 2xl:text-sm "
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h5 className="text-sm 2xl:text-[16px] font-medium">
                  Description
                </h5>
                <Field name="description">
                  {({ field }: any) => {
                    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const newValue = e.target.value;
                      
                      // Remove any leading spaces
                      const trimmedValue = newValue.trimStart();
                      if (trimmedValue !== newValue) {
                        // If leading spaces were removed, update with trimmed value
                        setFieldValue("description", trimmedValue, false);
                      } else {
                        // No leading spaces, allow the change
                        field.onChange(e);
                      }
                      setFieldTouched("description", true);
                    };

                    const handleDescriptionBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
                      // Trim trailing spaces on blur
                      const trimmedValue = e.target.value.trimEnd();
                      if (trimmedValue !== e.target.value) {
                        setFieldValue("description", trimmedValue, false);
                      }
                      field.onBlur(e);
                      setFieldTouched("description", true);
                    };

                    return (
                      <FormikTextarea
                        field={{
                          ...field,
                          onChange: handleDescriptionChange,
                          onBlur: handleDescriptionBlur,
                        }}
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
                      />
                    );
                  }}
                </Field>
                <div className="min-h-[17px]">
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs "
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
