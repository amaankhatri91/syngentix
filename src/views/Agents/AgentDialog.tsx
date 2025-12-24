import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { Input, Textarea } from "@material-tailwind/react";
import { Dialog } from "@/components/Dialog";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import { FormValues } from "./types";
import { AgentSchema } from "./AgentSchema";
import { useAppDispatch, useAppSelector } from "@/store";
import { setAgentDailog } from "@/store/agent/agentSlice";

const AgentDialog = () => {
  const { isDark } = useTheme();
  const { agentDailog } = useAppSelector((state) => state.agent);
  const dispatch = useAppDispatch();

  const handleCancel = (resetForm: () => void) => {
    dispatch(
      setAgentDailog({
        agentDailog: false,
        agentRow: {},
      })
    );
    resetForm();
  };

  return (
    <Dialog
      open={agentDailog}
      handler={() => {
        dispatch(
          setAgentDailog({
            agentDailog: false,
            agentRow: {},
          })
        );
      }}
      title="Create New Agent"
      size="sm"
      bodyClassName="!px-8 !pb-5"
    >
      <Formik<FormValues>
        initialValues={{
          agentName: "",
          description: "",
        }}
        validationSchema={AgentSchema}
        onSubmit={(values: FormValues) => {
          console.log(values, "Verify Values");
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
        }) => (
          <Form>
            <div>
              {/* Agent Name Field */}
              <div className="space-y-1">
                <h5 className="text-sm 2xl:text-[16px] font-medium">
                  Agent Name
                </h5>
                <Field name="agentName">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      type="text"
                      id="agentName"
                      placeholder="Please enter the agent name"
                      className={`
                        !border ${
                          errors.agentName && touched.agentName
                            ? "!border-red-500"
                            : "!border-gray-300"
                        }
                        !bg-white
                        !rounded-xl
                        ${
                          isDark ? "!text-gray-900" : "!text-gray-900 shadow-md"
                        }
                      `}
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{
                        className: "!min-w-0",
                      }}
                      error={!!(errors.agentName && touched.agentName)}
                      onBlur={() => setFieldTouched("agentName", true)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("agentName", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[17px]">
                  <ErrorMessage
                    name="agentName"
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
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Write something about your agent"
                      rows={4}
                      className={`
                        !border ${
                          errors.description && touched.description
                            ? "!border-red-500"
                            : "!border-gray-300"
                        }
                        !bg-white
                        !rounded-xl
                        ${
                          isDark ? "!text-gray-900" : "!text-gray-900 shadow-md"
                        }
                        !resize-none
                      `}
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{
                        className: "!min-w-0",
                      }}
                      error={!!(errors.description && touched.description)}
                      onBlur={() => setFieldTouched("description", true)}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setFieldValue("description", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              cancelText="Cancel"
              submitText="Create Agent"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AgentDialog;
