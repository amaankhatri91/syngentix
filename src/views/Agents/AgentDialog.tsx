import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { Dialog } from "@/components/Dialog";
import { FooterButtons } from "@/components/FooterButtons";
import { FormikInput } from "@/components/FormikInput";
import { FormikTextarea } from "@/components/FormikTextarea";
import useTheme from "@/utils/hooks/useTheme";
import { AgentFormValues } from "./types";
import { AgentSchema } from "./AgentSchema";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAgentDailog,
  createAgent,
  editAgent,
} from "@/store/agent/agentSlice";
import useRefetchQueries from "@/utils/hooks/useRefetchQueries";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

const AgentDialog = () => {
  const { isDark } = useTheme();
  const { agentDailog, agentRow } = useAppSelector((state) => state.agent);
  const dispatch = useAppDispatch();

  const { refetchAgents } = useRefetchQueries();

  const handleCancel = (resetForm?: () => void) => {
    dispatch(
      setAgentDailog({
        agentDailog: false,
        agentRow: {},
      })
    );
    if (resetForm) {
      resetForm();
    }
  };

  return (
    <Dialog
      open={agentDailog}
      handler={handleCancel}
      title={`${agentRow?.id ? "Edit" : "Create"} New Agent`}
      size="xs"
      bodyClassName="!px-8 !pb-5"
    >
      <Formik<AgentFormValues>
        initialValues={{
          agentName: agentRow?.name || "",
          description: agentRow?.description || "",
        }}
        validationSchema={AgentSchema}
        onSubmit={async (values: AgentFormValues) => {
          try {
            const response: any = agentRow?.id
              ? await dispatch(
                  editAgent({
                    id: agentRow?.agent_id,
                    agentName: values.agentName,
                    description: values.description,
                  })
                ).unwrap()
              : await dispatch(createAgent(values)).unwrap();

            if (response?.status === "success") {
              dispatch(
                setAgentDailog({
                  agentDailog: false,
                  agentRow: {},
                })
              );
              showSuccessToast(response.message || "Agent saved successfully");
              refetchAgents();
            } else {
              showErrorToast(response?.message || "Failed to save agent");
            }
          } catch (error: any) {
            console.log(error, "Verify Error");
            showErrorToast(
              error?.response?.data?.message ||
                error?.message ||
                "An error occurred while saving the agent"
            );
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
              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">Agent Name</h5>
                <Field name="agentName">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      className={`!py-5 ${
                        !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                      }`}
                      placeholder="Please enter the agent name"
                      errors={errors}
                      touched={touched}
                      onFieldTouched={() => setFieldTouched("agentName", true)}
                      onFieldChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue("agentName", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[20px] ">
                  <ErrorMessage
                    name="agentName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">Description</h5>
                <Field name="description">
                  {({ field }: any) => (
                    <FormikTextarea
                      field={field}
                      rows={4}
                      className={`${
                        !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                      }`}
                      placeholder="Write something about your agent"
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
                <div className="min-h-[20px] ">
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
            </div>
            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              cancelText="Cancel"
              submitText={`${agentRow?.id ? "Edit" : "Create"} Agent`}
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !dirty}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AgentDialog;
