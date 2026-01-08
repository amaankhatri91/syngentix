import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormikInput } from "@/components/FormikInput";
import { FormikTextarea } from "@/components/FormikTextarea";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector, useAppDispatch } from "@/store";
import { setOpenSettings } from "@/store/workflowEditor/workflowEditorSlice";
import * as Yup from "yup";
import CancelIcon from "@/assets/app-icons/CancelIcon";

interface WorkflowSettingsFormValues {
  workflowName: string;
  description: string;
  executionTimeout: number;
  retryAttempts: number;
  concurrencyLimit: boolean;
}

const WorkflowSettingsSchema = Yup.object().shape({
  workflowName: Yup.string().required("Required"),
  description: Yup.string(),
  executionTimeout: Yup.number()
    .min(1, "Execution timeout must be at least 1 second")
    .required("Execution timeout is required"),
  retryAttempts: Yup.number()
    .min(0, "Retry attempts must be 0 or greater")
    .required("Retry attempts is required"),
  concurrencyLimit: Yup.boolean(),
});

const WorkflowSettings: React.FC = () => {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const openSettings = useAppSelector(
    (state) => state.workflowEditor.openSettings
  );

  const handleClose = () => {
    dispatch(setOpenSettings(false));
  };

  if (!openSettings) return null;

  return (
    <div
      className={`h-full flex flex-col border rounded-2xl ${
        isDark
          ? "bg-[#0F1724]  border-[#2B3643]"
          : "bg-[#FFFFFF]  border-[#EEF4FF] shadow-[1px_4px_6px_0px_#2154EE1A]"
      }`}
    >
      <div
        className={`flex-1 ${isDark ? "bg-[#0D131A]" : "bg-white"} border ${
          isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
        } rounded-xl flex flex-col`}
      >
        <div className="p-4 pb-0 flex-shrink-0">
          {/* Header */}
          <div className="flex justify-between  items-center mb-4">
            <h3
              className={`text-base text-[18px] font-medium ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              Workflow Settings
            </h3>
            <CancelIcon />
          </div>
          <hr
            className={`border-t ${
              isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Formik<WorkflowSettingsFormValues>
            initialValues={{
              workflowName: "D1 Work Flow",
              description: "",
              executionTimeout: 300,
              retryAttempts: 1,
              concurrencyLimit: true,
            }}
            validationSchema={WorkflowSettingsSchema}
            onSubmit={async (values: WorkflowSettingsFormValues) => {
              try {
                console.log("Workflow Settings values:", values);
                // TODO: Implement save logic
                // dispatch(setOpenSettings(false));
              } catch (error: any) {
                console.log(error, "Verify Error");
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
            }) => (
              <Form className="h-full flex flex-col">
                <div className="flex-1">
                  {/* Workflow Identity Section */}
                  <div className="">
                    <span className={`text-base font-medium `}>
                      Workflow Identity
                    </span>

                    {/* Workflow Name */}
                    <div className="text-left w-full mt-4">
                      <label
                        className={`block text-sm mb-1 ${
                          isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                        }`}
                      >
                        Workflow Name <span className="text-red-500">*</span>
                      </label>
                      <Field name="workflowName">
                        {({ field }: any) => (
                          <FormikInput
                            field={field}
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
                              setFieldTouched("workflowName", true)
                            }
                            onFieldChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue("workflowName", e.target.value);
                            }}
                          />
                        )}
                      </Field>
                      <div className="min-h-[20px]">
                        <ErrorMessage
                          name="workflowName"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-left w-full">
                      <label
                        className={`block text-sm mb-1 ${
                          isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                        }`}
                      >
                        Description
                      </label>
                      <Field name="description">
                        {({ field }: any) => (
                          <FormikTextarea
                            field={field}
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
                            onFieldChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                              setFieldValue("description", e.target.value);
                            }}
                          />
                        )}
                      </Field>
                      <div className="min-h-[20px]">
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                    {/* Execution Settings Section */}
                    <div className="space-y-3">
                      <span className={`text-base font-medium`}>
                        Execution Settings
                      </span>
                      <div className="flex items-start gap-4">
                        {/* Execution Timeout */}
                        <div className="text-left flex-1">
                          <label
                            className={`block text-sm mb-1 ${
                              isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                            }`}
                          >
                            Execution Timeout
                          </label>
                          <div className="flex items-center gap-2">
                            <Field name="executionTimeout">
                              {({ field }: any) => (
                                <FormikInput
                                  field={field}
                                  type="number"
                                  className={`!py-3 flex-1 ${
                                    !isDark
                                      ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                                      : ""
                                  }`}
                                  placeholder="300"
                                  errors={errors}
                                  touched={touched}
                                  onFieldTouched={() =>
                                    setFieldTouched("executionTimeout", true)
                                  }
                                  onFieldChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue(
                                      "executionTimeout",
                                      parseInt(e.target.value) || 0
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <span
                              className={`text-sm whitespace-nowrap ${
                                isDark ? "text-[#A1A1A1]" : "text-[#737373]"
                              }`}
                            >
                              Seconds
                            </span>
                          </div>
                          <div className="min-h-[20px]">
                            <ErrorMessage
                              name="executionTimeout"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        </div>

                        {/* Retry Attempts */}
                        <div className="text-left flex-1">
                          <label
                            className={`block text-sm mb-1 ${
                              isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                            }`}
                          >
                            Retry Attempts
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = Math.max(
                                  0,
                                  values.retryAttempts - 1
                                );
                                setFieldValue("retryAttempts", newValue);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                isDark
                                  ? "bg-[#1E293B] hover:bg-[#2B3643] text-white border border-[#2B3643]"
                                  : "bg-white hover:bg-gray-50 text-[#162230] border border-[#E3E6EB] shadow-sm"
                              }`}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 6H10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                            <Field name="retryAttempts">
                              {({ field }: any) => (
                                <FormikInput
                                  field={field}
                                  type="number"
                                  className={`!py-3 flex-1 text-center ${
                                    !isDark
                                      ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                                      : ""
                                  }`}
                                  placeholder="1"
                                  errors={errors}
                                  touched={touched}
                                  onFieldTouched={() =>
                                    setFieldTouched("retryAttempts", true)
                                  }
                                  onFieldChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue(
                                      "retryAttempts",
                                      parseInt(e.target.value) || 0
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = values.retryAttempts + 1;
                                setFieldValue("retryAttempts", newValue);
                              }}
                              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                                isDark
                                  ? "bg-[#1E293B] hover:bg-[#2B3643] text-white border border-[#2B3643]"
                                  : "bg-white hover:bg-gray-50 text-[#162230] border border-[#E3E6EB] shadow-sm"
                              }`}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 2V10M2 6H10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="min-h-[20px]">
                            <ErrorMessage
                              name="retryAttempts"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Concurrency Control Section */}
                  <div className="space-y-4">
                    <h3
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-[#162230]"
                      }`}
                    >
                      Concurrency Control
                    </h3>

                    {/* Concurrency Limit Toggle */}
                    <div className="flex items-center justify-between">
                      <label
                        className={`text-sm ${
                          isDark ? "text-[#FFFFFF]" : "text-[#162230]"
                        }`}
                      >
                        Concurrency Limit
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue(
                            "concurrencyLimit",
                            !values.concurrencyLimit
                          );
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          values.concurrencyLimit
                            ? "bg-gradient-to-r from-[#9133EA] to-[#2962EB]"
                            : isDark
                            ? "bg-[#2B3643]"
                            : "bg-gray-300"
                        } ${
                          isDark
                            ? "focus:ring-[#9133EA]"
                            : "focus:ring-[#2962EB]"
                        }`}
                        role="switch"
                        aria-checked={values.concurrencyLimit}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            values.concurrencyLimit
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 pb-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#9133EA] to-[#2962EB] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSettings;
