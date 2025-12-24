import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { Input, Textarea } from "@material-tailwind/react";
import { Dialog } from "@/components/Dialog";
import { Button } from "@/components/Button";
import useTheme from "@/utils/hooks/useTheme";
import { FormValues } from "./types";
import { AgentSchema } from "./AgentSchema";
import { useAppSelector } from "@/store";

const AgentDialog = () => {
  const { isDark } = useTheme();
  const { agentDailog } = useAppSelector((state) => state.agent);

  const handleCancel = (resetForm: () => void) => {};

  const handler = () => {};

  return (
    <Dialog
      open={agentDailog}
      handler={handler}
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
            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 w-full pt-4">
              <Button
                type="button"
                onClick={() => handleCancel(resetForm)}
                backgroundColor={
                  isDark
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-[#E6E6E6] hover:bg-gray-300 text-gray-900"
                }
                width="w-full"
                className="px-6 !rounded-xl py-2.5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                backgroundColor="!bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-white"
                width="w-full"
                className="px-6 !rounded-xl py-2.5"
                loading={isSubmitting}
              >
                Create Agent
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AgentDialog;
