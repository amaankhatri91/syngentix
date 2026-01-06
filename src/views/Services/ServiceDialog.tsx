import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog } from "@/components/Dialog";
import { FooterButtons } from "@/components/FooterButtons";
import { FormikInput } from "@/components/FormikInput";
import useTheme from "@/utils/hooks/useTheme";
import { ServiceFormValues } from "./types";
import { ServiceSchema } from "./ServiceSchema";
import { Button } from "@/components/Button";

interface ServiceDialogProps {
  open: boolean;
  handler: () => void;
}

const ServiceDialog: React.FC<ServiceDialogProps> = ({ open, handler }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = (resetForm?: () => void) => {
    handler();
    if (resetForm) {
      resetForm();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      handler={handleCancel}
      title="Add New Service"
      size="sm"
      bodyClassName="!px-8 !pb-5"
    >
      <Formik<ServiceFormValues>
        initialValues={{
          connectionName: "",
          hostName: "",
          port: "",
          username: "",
          password: "",
          securitySSL: null,
        }}
        validationSchema={ServiceSchema}
        onSubmit={async (values: ServiceFormValues) => {
          try {
            console.log("Service values:", values);
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
              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">
                  Connection Name <span className="text-red-500">*</span>
                </h5>
                <Field name="connectionName">
                  {({ field }: any) => (
                    <FormikInput
                      field={field}
                      type="text"
                      className={`!py-5 ${
                        !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                      }`}
                      placeholder="Please enter connection name"
                      errors={errors}
                      touched={touched}
                      onFieldTouched={() =>
                        setFieldTouched("connectionName", true)
                      }
                      onFieldChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue("connectionName", e.target.value);
                      }}
                    />
                  )}
                </Field>
                <div className="min-h-[20px]">
                  <ErrorMessage
                    name="connectionName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-left flex-[0.6]">
                  <h5 className="block text-sm md:text-base mb-1">
                    Host Name <span className="text-red-500">*</span>
                  </h5>
                  <Field name="hostName">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                        }`}
                        placeholder="Please enter host name"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("hostName", true)}
                        onFieldChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("hostName", e.target.value);
                        }}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="hostName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="text-left flex-[0.4]">
                  <h5 className="block text-sm md:text-base mb-1">
                    Port <span className="text-red-500">*</span>
                  </h5>
                  <Field name="port">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                        }`}
                        placeholder="0000"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("port", true)}
                        onFieldChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("port", e.target.value);
                        }}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="port"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">
                  Username <span className="text-red-500">*</span>
                </h5>
                <Field name="username">
                  {({ field }: any) => (
                    <div className="relative">
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 !pr-10 ${
                          !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                        }`}
                        placeholder="Please enter username"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("username", true)}
                        onFieldChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("username", e.target.value);
                        }}
                      />
                    </div>
                  )}
                </Field>
                <div className="min-h-[20px]">
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">
                  Password <span className="text-red-500">*</span>
                </h5>
                <Field name="password">
                  {({ field }: any) => (
                    <div className="relative">
                      <FormikInput
                        field={field}
                        type="password"
                        className={`!py-5 !pr-10 ${
                          !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                        }`}
                        placeholder="Please enter your password"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("password", true)}
                        onFieldChange={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("password", e.target.value);
                        }}
                      />
                    </div>
                  )}
                </Field>
                <div className="min-h-[20px]">
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="text-left w-full">
                <h5 className="block text-sm md:text-base mb-1">
                  Security SSL
                </h5>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".crt,.pem,.cer"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFieldValue("securitySSL", file);
                    }}
                  />
                  <input
                    type="text"
                    readOnly
                    value={values.securitySSL ? values.securitySSL.name : ""}
                    className={`
                      w-full !py-2 !pr-24 px-4 !rounded-xl !border !border-gray-300 !bg-white !text-[#162230]
                      ${!isDark ? "!shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""}
                      cursor-pointer
                      [&::placeholder]:opacity-100
                      [&::placeholder]:text-[#737373]
                    `}
                    placeholder="Please upload CA certificate"
                    onClick={handleBrowseClick}
                  />
                  <Button
                    type="button"
                    onClick={handleBrowseClick}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                  >
                    Browse
                  </Button>
                </div>
              </div>
            </div>

            <FooterButtons
              onCancel={() => handleCancel(resetForm)}
              onSubmit={undefined}
              cancelText="Test Service"
              submitText="Add Service"
              isLoading={isSubmitting}
              isDisabled={isSubmitting || !dirty}
              submitType="submit"
              className="!justify-between !pt-6"
            />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ServiceDialog;
