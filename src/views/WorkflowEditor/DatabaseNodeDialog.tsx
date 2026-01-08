import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog } from "@/components/Dialog";
import { FormikInput } from "@/components/FormikInput";
import { FormikSelect } from "@/components/FormikSelect";
import { Button } from "@/components/Button";
import Tabs from "@/components/Tabs";
import { TabItem } from "@/components/Tabs";
import CancelIcon from "@/assets/app-icons/CancelIcon";
import useTheme from "@/utils/hooks/useTheme";

interface DatabaseNodeDialogProps {
  open: boolean;
  handler: () => void;
}

interface DatabaseFormValues {
  label: string;
  databaseType: string;
  host: string;
  port: string;
  username: string;
  password: string;
  caCertificate: string;
  securitySSL: File | null;
}

const databaseTypeOptions = [
  { value: "SQLite", label: "SQLite" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MySQL", label: "MySQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Oracle", label: "Oracle" },
  { value: "SQL Server", label: "SQL Server" },
];

const tabs: TabItem[] = [
  { label: "Data", value: "data" },
  { label: "Data Inputs", value: "dataInputs" },
  { label: "Data Outputs", value: "dataOutputs" },
  { label: "Out Pins", value: "outPins" },
];

const DatabaseNodeDialog: React.FC<DatabaseNodeDialogProps> = ({
  open,
  handler,
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string | number>("data");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = (resetForm?: () => void) => {
    handler();
    if (resetForm) {
      resetForm();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setActiveTab("data");
  };

  const handleCloseClick = () => {
    handleCancel();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      handler={handleCancel}
      size="lg"
      bodyClassName="!px-8 !pb-5"
    >
      {/* Custom Header with Title and Close Button */}
      <div className="flex items-center justify-between pt-8 px-8 pb-4">
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          Database Node
        </h2>
        <button
          type="button"
          onClick={handleCloseClick}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <CancelIcon theme={isDark ? "dark" : "light"} size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-8 pb-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="flex-wrap"
        />
      </div>

      {/* Form Content */}
      <Formik<DatabaseFormValues>
        initialValues={{
          label: "Database Connection",
          databaseType: "SQLite",
          host: "",
          port: "0000",
          username: "",
          password: "",
          caCertificate: "",
          securitySSL: null,
        }}
        onSubmit={async (values: DatabaseFormValues) => {
          try {
            console.log("Database Node values:", values);
            handler();
          } catch (error: any) {
            console.log(error, "Database Node Error");
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
          values,
        }) => (
          <Form>
            {/* Data Tab Content */}
            {activeTab === "data" && (
              <div className="space-y-4 px-8">
                {/* Label */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">
                    Label
                  </h5>
                  <Field name="label">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="Please enter Label"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("label", true)}
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("label", e.target.value);
                        }}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="label"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Database Type */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">
                    Database Type
                  </h5>
                  <Field name="databaseType">
                    {({ field }: any) => (
                      <FormikSelect
                        field={field}
                        options={databaseTypeOptions}
                        placeholder="Please select Database Type"
                        className="w-full"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() =>
                          setFieldTouched("databaseType", true)
                        }
                        onFieldChange={(option: any) => {
                          setFieldValue("databaseType", option?.value || "");
                        }}
                        menuPortalTarget={document.body}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="databaseType"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Host */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">Host</h5>
                  <Field name="host">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="Please enter Host name"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("host", true)}
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("host", e.target.value);
                        }}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="host"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Port */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">Port</h5>
                  <Field name="port">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="0000"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("port", true)}
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

                {/* Username */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">Username</h5>
                  <Field name="username">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="Please enter Username"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("username", true)}
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("username", e.target.value);
                        }}
                      />
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

                {/* Password */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">Password</h5>
                  <Field name="password">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="password"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="Please enter Password"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() => setFieldTouched("password", true)}
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("password", e.target.value);
                        }}
                      />
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

                {/* CA Certificate (Optional) */}
                <div className="text-left w-full">
                  <h5 className="block text-sm md:text-base mb-1">
                    CA Certificate (Optional)
                  </h5>
                  <Field name="caCertificate">
                    {({ field }: any) => (
                      <FormikInput
                        field={field}
                        type="text"
                        className={`!py-5 ${
                          !isDark
                            ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                            : ""
                        }`}
                        placeholder="Please enter CA Certificate"
                        errors={errors}
                        touched={touched}
                        onFieldTouched={() =>
                          setFieldTouched("caCertificate", true)
                        }
                        onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("caCertificate", e.target.value);
                        }}
                      />
                    )}
                  </Field>
                  <div className="min-h-[20px]">
                    <ErrorMessage
                      name="caCertificate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Security SSL */}
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
                        w-full !py-2 !pr-24 px-4 !rounded-xl !border
                        ${
                          isDark
                            ? "!bg-[#0F141D] !border-[#2B3643] !text-white"
                            : "!bg-white !border-[#E3E6EB] !text-[#162230] shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]"
                        }
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
            )}

            {/* Other Tabs Content (Placeholder) */}
            {activeTab !== "data" && (
              <div className="px-8 py-8 text-center">
                <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {activeTab === "dataInputs" && "Data Inputs content coming soon"}
                  {activeTab === "dataOutputs" && "Data Outputs content coming soon"}
                  {activeTab === "outPins" && "Out Pins content coming soon"}
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-center pt-6 pb-5 px-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="!px-8 !py-3 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-base font-medium"
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default DatabaseNodeDialog;

