import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { FormikTextarea } from "@/components/FormikTextarea";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector, useAppDispatch } from "@/store";
import { setPanelStep } from "@/store/workflowEditor/workflowEditorSlice";
import { updateWorkflowSettings } from "@/store/workflow/workflowSlice";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import * as Yup from "yup";
import CancelIcon from "@/assets/app-icons/CancelIcon";
import MinusIcon from "@/assets/app-icons/MinusIcon";
import { Add } from "@/assets/app-icons";

interface WorkflowSettingsFormValues {
  title: string;
  description: string;
  execution_timeout: number;
  retry_attempts: number;
  concurrency_limit: boolean;
}

const WorkflowSettingsSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string(),
  execution_timeout: Yup.number()
    .min(1, "at least 1 second")
    .required("Required"),
  retry_attempts: Yup.number()
    .min(0, "Retry attempts must be 0 or greater")
    .required("Required"),
  concurrency_limit: Yup.boolean(),
});

const WorkflowSettings: React.FC = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { workflowId, agentId } = useParams<{
    workflowId: string;
    agentId: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const panelStep = useAppSelector(
    (state) => state.workflowEditor.panelStep
  );

  const {
    workflowTitle: workflowTitleFromState = "",
    workflowDescription: workflowDescriptionFromState = "",
    execution_timeout: executionTimeoutFromState,
    retry_attempts: retryAttemptsFromState,
    concurrency_limit: concurrencyLimitFromState,
  } = (location.state as {
    workflowTitle?: string;
    workflowDescription?: string;
    execution_timeout?: number;
    retry_attempts?: number;
    concurrency_limit?: boolean;
  }) || {};

  const handleClose = () => {
    dispatch(setPanelStep(null));
  };

  if (panelStep !== "settings") return null;

  return (
    <div
      className={`h-auto max-h-[calc(100vh-174px)] flex flex-col border rounded-2xl ${
        isDark
          ? "bg-[#0F1724]  border-[#2B3643]"
          : "bg-[#FFFFFF]  border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div
        className={`flex-1 min-h-0 ${
          isDark ? "bg-[#111A2A]" : "bg-white"
        } border ${
          isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
        } rounded-xl flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 pb-0 flex-shrink-0">
          <div className="flex justify-between  items-center mb-4">
            <h3
              className={`text-base text-[18px] font-medium ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              Workflow Settings
            </h3>
            <button onClick={handleClose} className="cursor-pointer">
              <CancelIcon theme={isDark ? "dark" : "light"} size={28} />
            </button>
          </div>
          <hr
            className={`border-t ${
              isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
            }`}
          />
        </div>

        {/* Main Content - Scrollable */}
        <Formik<WorkflowSettingsFormValues>
          initialValues={{
            title: workflowTitleFromState,
            description: workflowDescriptionFromState,
            execution_timeout: executionTimeoutFromState ?? 0,
            retry_attempts: retryAttemptsFromState ?? 1,
            concurrency_limit: concurrencyLimitFromState ?? true,
          }}
          enableReinitialize
          validationSchema={WorkflowSettingsSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={async (values: WorkflowSettingsFormValues) => {
            try {
              if (!workflowId) {
                showErrorToast("Workflow ID is missing");
                return;
              }
              const response: any = await dispatch(
                updateWorkflowSettings({
                  workflowId,
                  title: values.title,
                  description: values.description,
                  execution_timeout: values.execution_timeout,
                  retry_attempts: values.retry_attempts,
                  concurrency_limit: values.concurrency_limit,
                })
              ).unwrap();

              if (response?.data?.status === "success") {
                showSuccessToast(
                  response?.data?.message ||
                    "Workflow settings updated successfully"
                );

                // Update location state with new values for breadcrumb and settings
                navigate(`/agent/${agentId}/workflow/${workflowId}`, {
                  state: {
                    workflowTitle: values.title.trim(),
                    workflowDescription: values.description.trim(),
                    execution_timeout: values.execution_timeout,
                    retry_attempts: values.retry_attempts,
                    concurrency_limit: values.concurrency_limit,
                  },
                  replace: true,
                });

                dispatch(setPanelStep(null));
              } else {
                showErrorToast(
                  response?.data?.message ||
                    "Failed to update workflow settings. Please try again."
                );
              }
            } catch (error: any) {
              const errorMessage =
                error?.message ||
                error?.response?.data?.message ||
                error?.data?.message ||
                "Failed to update workflow settings. Please try again.";
              showErrorToast(errorMessage);
              console.error(error, "Verify Error");
            }
          }}
        >
          {({
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            values,
            isSubmitting,
            dirty,
          }) => (
            <Form className="flex flex-col max-h-[calc(100vh-250px)]">
              <div className="flex-1 overflow-y-auto nodes-list-scrollbar min-h-0">
                <div className="p-4">
                  <span className={`text-base`}>Workflow Identity</span>
                  {/* Workflow Name */}
                  <div className="text-left w-full mt-2">
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                      }`}
                    >
                      Workflow Name <span className="text-red-500">*</span>
                    </label>
                    <Field name="title">
                      {({ field }: any) => {
                        const handleTitleChange = (
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
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

                        const handleTitleBlur = (
                          e: React.FocusEvent<HTMLInputElement>
                        ) => {
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
                            className={`!py-3 ${
                              !isDark
                                ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                                : ""
                            }`}
                            placeholder="Enter workflow name"
                            errors={errors}
                            touched={touched}
                            onFieldTouched={() =>
                              setFieldTouched("title", true)
                            }
                          />
                        );
                      }}
                    </Field>
                    <div className="min-h-[18px]">
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-left w-full">
                    <label
                      className={`block text-sm mb-2 ${
                        isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                      }`}
                    >
                      Description
                    </label>
                    <Field name="description">
                      {({ field }: any) => {
                        const handleDescriptionChange = (
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
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

                        const handleDescriptionBlur = (
                          e: React.FocusEvent<HTMLTextAreaElement>
                        ) => {
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
                            className={`!py-3 ${
                              !isDark
                                ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                                : ""
                            }`}
                            placeholder="Lorem ipsum dolor sit amet consectetur."
                            rows={3}
                            errors={errors}
                            touched={touched}
                            onFieldTouched={() =>
                              setFieldTouched("description", true)
                            }
                          />
                        );
                      }}
                    </Field>
                    <div className="min-h-[10px]">
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                  {/*  */}
                  {/* Execution Settings Section */}
                  <div className="w-full">
                    {/* Title */}
                    <div className="mb-4">
                      <span
                        className={`text-base font-medium ${
                          isDark ? "text-[#A8B3CF]" : "text-[#162230]"
                        }`}
                      >
                        Execution Settings
                      </span>
                    </div>

                    {/* Fields */}
                    <div className="flex gap-4 min-w-0">
                      {/* Execution Timeout (BIGGER) */}
                      <div className="flex-[2] min-w-0">
                        <label
                          className={`block text-sm mb-2 ${
                            isDark ? "text-white" : "text-[#162230]"
                          }`}
                        >
                          Execution Timeout
                        </label>
                        <div
                          className={`flex items-center py-2.5 rounded-lg border px-4 ${
                            isDark
                              ? "border-[#2B3643] bg-[#0D131A]"
                              : "border-[#E3E6EB] bg-white shadow-[0_4px_8px_rgba(1,5,17,0.1)]"
                          }`}
                        >
                          <Field name="execution_timeout">
                            {({ field }: any) => (
                              <input
                                {...field}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={5} 
                                placeholder="300"
                                onChange={(e) => {
                                  setFieldValue("execution_timeout", e.target.value);
                                  setFieldTouched("execution_timeout", true);
                                }}
                                onBlur={(e) => {
                                  field.onBlur(e);
                                  setFieldTouched("execution_timeout", true);
                                }}
                                className={`flex-1 bg-transparent outline-none border-0 text-sm font-medium
                                   ${isDark ? "text-white" : "text-[#162230]"}
                                   [appearance:textfield]
                                 `}
                              />
                            )}
                          </Field>
                          <span
                            className={`text-sm whitespace-nowrap -ml-12 ${
                              isDark ? "text-[#8E9BB0]" : "text-[#737373]"
                            }`}
                          >
                            Seconds
                          </span>
                        </div>
                        <div className="min-h-[18px] mt-1">
                          <ErrorMessage
                            name="execution_timeout"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex-[18px] min-w-0">
                        <label
                          className={`block text-sm mb-2 ${
                            isDark ? "text-white" : "text-[#162230]"
                          }`}
                        >
                          Retry Attempts
                        </label>

                        <div
                          className={`flex items-center py-2 rounded-lg overflow-hidden border ${
                            isDark
                              ? "border-[#2B3643] bg-[#0D131A]"
                              : "border-[#E3E6EB] bg-white shadow-[0_4px_8px_rgba(1,5,17,0.1)]"
                          }`}
                        >
                          {/* Minus */}
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue(
                                "retry_attempts",
                                Math.max(0, values.retry_attempts - 1)
                              );
                              setFieldTouched("retry_attempts", true);
                            }}
                            className={`flex items-center  justify-center w-12 h-full transition `}
                          >
                            <MinusIcon />
                          </button>

                          <div
                            className={`w-px h-6 ${
                              isDark ? "bg-[#2B3643]" : "bg-[#E3E6EB]"
                            }`}
                          />
                          {/* Value */}
                          <Field name="retry_attempts">
                            {({ field }: any) => (
                              <input
                                {...field}
                                type="number"
                                inputMode="numeric"
                                onChange={(e) => {
                                  setFieldValue(
                                    "retry_attempts",
                                    Number(e.target.value) || 0
                                  );
                                  setFieldTouched("retry_attempts", true);
                                }}
                                onBlur={(e) => {
                                  field.onBlur(e);
                                  setFieldTouched("retry_attempts", true);
                                }}
                                className={`w-14 text-center bg-transparent outline-none border-0 text-sm font-medium
                                  ${isDark ? "text-white" : "text-[#162230]"}
                                  [appearance:textfield]
                                  [&::-webkit-outer-spin-button]:appearance-none
                                  [&::-webkit-inner-spin-button]:appearance-none
                                `}
                              />
                            )}
                          </Field>
                          <div
                            className={`w-px h-6 ${
                              isDark ? "bg-[#2B3643]" : "bg-[#E3E6EB]"
                            }`}
                          />
                          {/* Plus */}
                          <button
                            type="button"
                            onClick={() => {
                              setFieldValue(
                                "retry_attempts",
                                values.retry_attempts + 1
                              );
                              setFieldTouched("retry_attempts", true);
                            }}
                            className={`flex items-center justify-center w-12 h-full transition`}
                          >
                            <Add size={18} color={isDark ? "white" : ""} />
                          </button>
                        </div>
                        <div className="min-h-[20px] mt-1">
                          <ErrorMessage
                            name="retry_attempts"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    {/* Section Title */}
                    <div className="mb-3">
                      <span
                        className={`text-base font-medium ${
                          isDark ? "text-[#A8B3CF]" : "text-[#162230]"
                        }`}
                      >
                        Concurrency Control
                      </span>
                    </div>
                    {/* Card */}
                    <div
                      className={`flex items-center justify-between h-12 px-4 rounded-lg border transition-colors
                        ${isDark ? "border-[#364152]" : "border-[#E3E6EB]"}
                        ${
                          isDark
                            ? "bg-[#0D131A]"
                            : "bg-white shadow-[0_4px_8px_rgba(1,5,17,0.1)]"
                        }
                      `}
                    >
                      {/* Label */}
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-[#162230]"
                        }`}
                      >
                        Concurrency Limit
                      </span>

                      {/* Small Toggle */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values.concurrency_limit}
                        onClick={() =>
                          setFieldValue(
                            "concurrency_limit",
                            !values.concurrency_limit
                          )
                        }
                        className={`relative inline-flex items-center rounded-full transition-all duration-200
                          h-5 w-9 border
                          ${
                            values.concurrency_limit
                              ? "border-transparent shadow-[0_0_0_2px_rgba(145,51,234,0.4)]"
                              : isDark
                              ? "bg-[#2B3643] border-[#3A4658]"
                              : "bg-gray-300 border-gray-400"
                          }
                        `}
                        style={
                          values.concurrency_limit
                            ? {
                                background:
                                  "linear-gradient(90deg, #9133EA 0%, #2962EB 100%)",
                              }
                            : undefined
                        }
                      >
                        <span
                          className={`absolute left-0.5 inline-block h-3 w-3 rounded-full bg-white transition-transform duration-200
                              ${
                                values.concurrency_limit
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }
                            `}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Save Button - Fixed at bottom */}
              <div className="pt-2 pb-4 px-4 flex justify-center flex-shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting || !dirty}
                  className="bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white rounded-lg py-2 px-6 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default WorkflowSettings;
