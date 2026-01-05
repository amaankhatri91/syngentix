import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Textarea } from "@material-tailwind/react";
import { Dialog } from "@/components/Dialog";
import { FormikInput } from "@/components/FormikInput";
import { FooterButtons } from "@/components/FooterButtons";
import useTheme from "@/utils/hooks/useTheme";
import { FileFormValues } from "./types";
import { FileSchema } from "./FileSchema";

interface AddFileDialogProps {
  open: boolean;
  handler: () => void;
}

const AddFileDialog: React.FC<AddFileDialogProps> = ({ open, handler }) => {
  const { isDark } = useTheme();

  const handleCancel = (resetForm?: () => void) => {
    handler();
    if (resetForm) {
      resetForm();
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleCancel}
      title="Add File"
      size="sm"
      bodyClassName="!px-8 !pb-5"
    >
      <div className="mb-4">
        <p className={`text-md text-center`}>
          Create a new file and add your content.
        </p>
      </div>
      <Formik<FileFormValues>
        initialValues={{
          title: "",
          description: "",
          content: "",
          isSearchable: false,
          isAlwaysOn: false,
        }}
        validationSchema={FileSchema}
        onSubmit={async (values: FileFormValues) => {
          try {
            console.log("File values:", values);
            handler();
          } catch (error: any) {
            console.log(error, "Verify Error");
          }
        }}
      >
        {({
          resetForm,
          isSubmitting,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          dirty,
          values,
        }) => (
          <Form>
            <div className="space-y-4">
              <div className="space-y-1">
                <h5 className="text-[14px] font-medium leading-[14px]">
                  File Name
                </h5>
                <Field name="title">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      id="title"
                      placeholder="Please enter a file name."
                      className={`
                        !min-w-0
                        ${
                          isDark ? "!text-gray-900" : "!text-gray-900 shadow-md"
                        }
                        [&::placeholder]:text-[14px]
                        [&::placeholder]:font-normal
                        [&_input::placeholder]:text-[14px]
                        [&_input::placeholder]:font-normal
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
                <h5 className="text-[14px] font-medium leading-[14px]">
                  File Description
                </h5>
                <Field name="description">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      id="description"
                      placeholder="Please enter the description"
                      className={`
                        !min-w-0
                        ${
                          isDark ? "!text-gray-900" : "!text-gray-900 shadow-md"
                        }
                        [&::placeholder]:text-[14px]
                        [&::placeholder]:font-normal
                        [&_input::placeholder]:text-[14px]
                        [&_input::placeholder]:font-normal
                      `}
                      errors={errors}
                      touched={touched}
                      onFieldTouched={() =>
                        setFieldTouched("description", true)
                      }
                      onFieldChange={(
                        e: React.ChangeEvent<HTMLInputElement>
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
                    className="text-red-500 text-xs 2xl:text-sm mt-1"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-[14px] font-medium leading-[14px]">
                  Content
                </h5>
                <Field name="content">
                  {({ field }: any) => (
                    <Textarea
                      {...field}
                      id="content"
                      placeholder="Please enter the file content"
                      rows={4}
                      className={`
                        !border ${
                          errors.content && touched.content
                            ? "!border-red-500"
                            : "!border-gray-300"
                        }
                        !bg-white
                        !rounded-xl
                        ${
                          isDark ? "!text-gray-900" : "!text-gray-900 shadow-md"
                        }
                        !resize-none
                        [&::placeholder]:text-[14px]
                        [&::placeholder]:font-normal
                        [&_textarea::placeholder]:text-[14px]
                        [&_textarea::placeholder]:font-normal
                      `}
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{
                        className: "!min-w-0",
                      }}
                      error={!!(errors.content && touched.content)}
                      onBlur={() => setFieldTouched("content", true)}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setFieldValue("content", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Field name="isSearchable" type="checkbox">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="isSearchable"
                        checked={values.isSearchable}
                        onChange={(e) => {
                          setFieldValue("isSearchable", e.target.checked);
                        }}
                        className={`
                          w-4 h-4 rounded-[4px] border-2
                          ${
                            isDark
                              ? "border-[#7E89AC] bg-[#0B1739] checked:bg-[#2962EB] checked:border-[#2962EB]"
                              : "border-gray-300 bg-white checked:bg-white checked:border-[#2962EB]"
                          }
                          focus:ring-2 focus:ring-[#2962EB] focus:ring-offset-0
                          cursor-pointer
                          appearance-none
                          relative
                        `}
                        style={{
                          backgroundImage: values.isSearchable
                            ? isDark
                              ? `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                              : `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='%232962EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                            : "none",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "12px",
                        }}
                      />
                    )}
                  </Field>
                  <label
                    htmlFor="isSearchable"
                    className={`text-[14px] font-normal cursor-pointer ${
                      isDark ? "text-[#BDC9F5]" : "text-gray-600"
                    }`}
                  >
                    Searchable
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Field name="isAlwaysOn" type="checkbox">
                    {({ field }: any) => (
                      <input
                        {...field}
                        type="checkbox"
                        id="isAlwaysOn"
                        checked={values.isAlwaysOn}
                        onChange={(e) => {
                          setFieldValue("isAlwaysOn", e.target.checked);
                        }}
                        className={`
                          w-4 h-4 rounded-[4px] border-2
                          ${
                            isDark
                              ? "border-[#7E89AC] bg-[#0B1739] checked:bg-[#2962EB] checked:border-[#2962EB]"
                              : "border-gray-300 bg-white checked:bg-white checked:border-[#2962EB]"
                          }
                          focus:ring-2 focus:ring-[#2962EB] focus:ring-offset-0
                          cursor-pointer
                          appearance-none
                          relative
                        `}
                        style={{
                          backgroundImage: values.isAlwaysOn
                            ? isDark
                              ? `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                              : `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 3L4.5 8.5L2 6' stroke='%232962EB' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                            : "none",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "12px",
                        }}
                      />
                    )}
                  </Field>
                  <label
                    htmlFor="isAlwaysOn"
                    className={`text-[14px] font-normal cursor-pointer ${
                      isDark ? "text-[#BDC9F5]" : "text-gray-600"
                    }`}
                  >
                    Add to Context
                  </label>
                </div>
              </div>
            </div>
            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              cancelText="Cancel"
              submitText="Add File"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !dirty}
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddFileDialog;
