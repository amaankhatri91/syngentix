import React, { useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { Input, Textarea } from "@material-tailwind/react";
import { Dialog } from "@/components/Dialog";
import { Button } from "@/components/Button";
import { useAppSelector } from "@/store";
import { FormValues } from "./type";
import { agentSchema } from "./agentSchema";

const AgentDialog = () => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  const handleCancel = (resetForm: () => void) => {};

  const handler = () => {};

  return (
    <Dialog
      open={true}
      handler={handler}
      title="Create New Agent"
      size="sm"
      bodyClassName=""
    >
      <Formik<FormValues>
        initialValues={{
          agentName: "",
          description: "",
        }}
        validationSchema={agentSchema}
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
                <h5 className={`text-sm font-medium `}>Agent Name</h5>
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
                        ${isDark ? "!text-gray-900" : "!text-gray-900"}
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
                <ErrorMessage
                  name="agentName"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <h5 className={`text-sm font-medium `}>Description</h5>
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
                        ${isDark ? "!text-gray-900" : "!text-gray-900"}
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
            <div className="flex justify-end gap-3 w-full pt-6 ">
              <Button
                type="button"
                onClick={() => handleCancel(resetForm)}
                backgroundColor={
                  isDark
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }
                width="w-auto"
                height="h-10"
                className="px-6 !rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                backgroundColor="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                width="w-auto"
                height="h-10"
                className="px-6 !rounded-xl"
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
