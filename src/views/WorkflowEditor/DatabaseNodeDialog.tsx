import React, { useRef, useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Dialog } from "@/components/Dialog";
import { FormikInput } from "@/components/FormikInput";
import { FormikSelect } from "@/components/FormikSelect";
import { FormikTextarea } from "@/components/FormikTextarea";
import { Button } from "@/components/Button";
import Tabs from "@/components/Tabs";
import { TabItem } from "@/components/Tabs";
import CancelIcon from "@/assets/app-icons/CancelIcon";
import useTheme from "@/utils/hooks/useTheme";
import { NodePin } from "./type";
import WorkflowPinsManager from "./WorkflowPinsManager";
import { useAppSelector } from "@/store";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";

interface DatabaseNodeDialogProps {
  open?: boolean;
  handler?: () => void;
  nodesData?: any;
  nodesLoading?: boolean;
  nodesError?: any;
  selectedNode?: any | null;
  workflowId?: string;
}

interface ConfigSchemaProperty {
  type?: string;
  title?: string;
  description?: string;
  default?: any;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  items?: ConfigSchemaProperty;
  properties?: Record<string, ConfigSchemaProperty>;
  required?: string[];
}

const tabs: TabItem[] = [
  { label: "Data", value: "data" },
  { label: "Data Inputs", value: "dataInputs" },
  { label: "Data Outputs", value: "dataOutputs" },
  { label: "Out Pins", value: "outPins" },
];

const DatabaseNodeDialog = ({
  open = false,
  handler,
  nodesData,
  nodesLoading,
  nodesError,
  selectedNode,
  workflowId,
}: DatabaseNodeDialogProps) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string | number>("data");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { emit } = useSocketConnection();

  const nodeData = useMemo(() => {
    return selectedNode?.data || null;
  }, [selectedNode]);

  // Get config schema from selected node
  const configSchema = useMemo(() => {
    return nodeData?.config_schema;
  }, [nodeData]);

  // Get pins data
  const inputs = useMemo(() => nodeData?.inputs || [], [nodeData]);
  const outputs = useMemo(() => nodeData?.outputs || [], [nodeData]);
  const nextPins = useMemo(() => nodeData?.next_pins || [], [nodeData]);

  // State for managing pins (for adding/removing)
  const [localInputs, setLocalInputs] = useState<NodePin[]>(inputs);
  const [localOutputs, setLocalOutputs] = useState<NodePin[]>(outputs);
  const [localNextPins, setLocalNextPins] = useState<NodePin[]>(nextPins);

  console.log(selectedNode, "verify Selected node");

  // Update local state when nodeData changes
  React.useEffect(() => {
    setLocalInputs(inputs);
    setLocalOutputs(outputs);
    setLocalNextPins(nextPins);
  }, [inputs, outputs, nextPins]);

  // Generate initial values from config schema and node data
  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};

    // Add label field (from selectedNode.label)
    values.label = selectedNode?.data?.label || "";

    // Get existing config data from selectedNode.data if available
    const existingConfig = selectedNode?.data?.config || {};

    if (configSchema?.properties) {
      Object.entries(configSchema.properties).forEach(([key, prop]) => {
        const property = prop as ConfigSchemaProperty;

        // Use existing value from node data if available, otherwise use default
        if (existingConfig[key] !== undefined) {
          values[key] = existingConfig[key];
        } else if (property.default !== undefined) {
          values[key] = property.default;
        } else {
          // Set default based on type
          switch (property.type) {
            case "string":
              values[key] = "";
              break;
            case "number":
              values[key] = property.minimum || 0;
              break;
            case "boolean":
              values[key] = false;
              break;
            case "array":
              values[key] = [];
              break;
            case "object":
              values[key] = {};
              break;
            default:
              values[key] = "";
          }
        }
      });
    }

    return values;
  }, [configSchema, selectedNode]);

  // Render dynamic form field based on property type
  const renderField = (
    fieldName: string,
    property: ConfigSchemaProperty,
    errors: any,
    touched: any,
    setFieldValue: any,
    setFieldTouched: any,
    values: any
  ) => {
    const isRequired = configSchema?.required?.includes(fieldName);

    // Handle enum (dropdown)
    if (property.enum && property.enum.length > 0) {
      const options = property.enum.map((value) => ({
        value,
        label: value,
      }));

      return (
        <div key={fieldName} className="text-left w-full">
          <h5 className="block text-sm md:text-base mb-1">
            {property.title || fieldName}
            {isRequired && <span className="text-red-500">*</span>}
          </h5>
          {property.description && (
            <p className="text-xs text-gray-500 mb-2">{property.description}</p>
          )}
          <Field name={fieldName}>
            {({ field }: any) => (
              <FormikSelect
                field={field}
                options={options}
                placeholder={`Please select ${property.title || fieldName}`}
                className="w-full"
                errors={errors}
                touched={touched}
                onFieldTouched={() => setFieldTouched(fieldName, true)}
                onFieldChange={(option: any) => {
                  setFieldValue(fieldName, option?.value || "");
                }}
                menuPortalTarget={document.body}
              />
            )}
          </Field>
          <div className="min-h-[20px]">
            <ErrorMessage
              name={fieldName}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      );
    }

    // Handle boolean (checkbox)
    if (property.type === "boolean") {
      return (
        <div key={fieldName} className="text-left w-full">
          <div className="flex items-center gap-2">
            <Field name={fieldName} type="checkbox">
              {({ field }: any) => (
                <input
                  {...field}
                  type="checkbox"
                  id={fieldName}
                  checked={values[fieldName] || false}
                  onChange={(e) => {
                    setFieldValue(fieldName, e.target.checked);
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
                    backgroundImage: values[fieldName]
                      ? "url(\"data:image/svg+xml,%3Csvg width='12' height='9' viewBox='0 0 12 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4.5L4.5 8L11 1' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
                      : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}
            </Field>
            <label
              htmlFor={fieldName}
              className={`text-sm md:text-base cursor-pointer ${
                isDark ? "text-white" : "text-[#162230]"
              }`}
            >
              {property.title || fieldName}
              {isRequired && <span className="text-red-500">*</span>}
            </label>
          </div>
          {property.description && (
            <p className="text-xs text-gray-500 mt-1 ml-6">
              {property.description}
            </p>
          )}
          <div className="min-h-[20px]">
            <ErrorMessage
              name={fieldName}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      );
    }

    // Handle number
    if (property.type === "number") {
      return (
        <div key={fieldName} className="text-left w-full">
          <h5 className="block text-sm md:text-base mb-1">
            {property.title || fieldName}
            {isRequired && <span className="text-red-500">*</span>}
          </h5>
          {property.description && (
            <p className="text-xs text-gray-500 mb-2">{property.description}</p>
          )}
          <Field name={fieldName}>
            {({ field }: any) => (
              <FormikInput
                field={field}
                type="number"
                min={property.minimum}
                max={property.maximum}
                className={`!py-5 ${
                  !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                }`}
                placeholder={`Please enter ${property.title || fieldName}`}
                errors={errors}
                touched={touched}
                onFieldTouched={() => setFieldTouched(fieldName, true)}
                onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue(fieldName, e.target.value);
                }}
              />
            )}
          </Field>
          <div className="min-h-[20px]">
            <ErrorMessage
              name={fieldName}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      );
    }

    // Handle array (for now, render as JSON textarea)
    if (property.type === "array") {
      return (
        <div key={fieldName} className="text-left w-full">
          <h5 className="block text-sm md:text-base mb-1">
            {property.title || fieldName}
            {isRequired && <span className="text-red-500">*</span>}
          </h5>
          {property.description && (
            <p className="text-xs text-gray-500 mb-2">{property.description}</p>
          )}
          <Field name={fieldName}>
            {({ field }: any) => (
              <FormikTextarea
                field={field}
                className={`!py-5 min-h-[100px] ${
                  !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                }`}
                placeholder={`Please enter ${
                  property.title || fieldName
                } (JSON array)`}
                errors={errors}
                touched={touched}
                onFieldTouched={() => setFieldTouched(fieldName, true)}
                onFieldChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFieldValue(fieldName, parsed);
                  } catch {
                    setFieldValue(fieldName, e.target.value);
                  }
                }}
              />
            )}
          </Field>
          <div className="min-h-[20px]">
            <ErrorMessage
              name={fieldName}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      );
    }

    // Handle object (render as JSON textarea for now)
    if (property.type === "object") {
      return (
        <div key={fieldName} className="text-left w-full">
          <h5 className="block text-sm md:text-base mb-1">
            {property.title || fieldName}
            {isRequired && <span className="text-red-500">*</span>}
          </h5>
          {property.description && (
            <p className="text-xs text-gray-500 mb-2">{property.description}</p>
          )}
          <Field name={fieldName}>
            {({ field }: any) => (
              <FormikTextarea
                field={{
                  ...field,
                  value:
                    typeof field.value === "object"
                      ? JSON.stringify(field.value, null, 2)
                      : field.value || "",
                }}
                className={`!py-5 min-h-[100px] ${
                  !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
                }`}
                placeholder={`Please enter ${
                  property.title || fieldName
                } (JSON object)`}
                errors={errors}
                touched={touched}
                onFieldTouched={() => setFieldTouched(fieldName, true)}
                onFieldChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFieldValue(fieldName, parsed);
                  } catch {
                    setFieldValue(fieldName, e.target.value);
                  }
                }}
              />
            )}
          </Field>
          <div className="min-h-[20px]">
            <ErrorMessage
              name={fieldName}
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        </div>
      );
    }

    // Default: string input
    return (
      <div key={fieldName} className="text-left w-full">
        <h5 className="block text-sm md:text-base mb-1">
          {property.title || fieldName}
          {isRequired && <span className="text-red-500">*</span>}
        </h5>
        {property.description && (
          <p className="text-xs text-gray-500 mb-2">{property.description}</p>
        )}
        <Field name={fieldName}>
          {({ field }: any) => (
            <FormikInput
              field={field}
              type="text"
              className={`!py-5 ${
                !isDark ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""
              }`}
              placeholder={`Please enter ${property.title || fieldName}`}
              errors={errors}
              touched={touched}
              onFieldTouched={() => setFieldTouched(fieldName, true)}
              onFieldChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue(fieldName, e.target.value);
              }}
            />
          )}
        </Field>
        <div className="min-h-[20px]">
          <ErrorMessage
            name={fieldName}
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    );
  };

  const handleCancel = (resetForm?: () => void) => {
    if (handler) {
      handler();
    }
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

  return (
    <Dialog
      open={open}
      handler={handleCancel}
      size="sm"
      bodyClassName="!p-0"
      disableOuterScroll={true}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            console.log("Node Configuration values:", values);

            if (!workflowId || !selectedNode?.id) {
              console.error("Missing workflowId or nodeId");
              return;
            }

            // Extract label and config from values
            const { label, ...config } = values;

            // Prepare node:update payload
            const updatePayload = {
              workflow_id: workflowId,
              id: selectedNode.id,
              data: {
                label: label || null,
                ...config,
              },
              node_type: selectedNode.type, // Optional field
            };

            console.log("Node update payload:", updatePayload);
            emit("node:update", updatePayload);

            // Optionally close the dialog after successful update
            // The server will send node:updated event which we can listen to
          } catch (error: any) {
            console.log(error, "Node Configuration Error");
          }
        }}
      >
        {({
          isSubmitting,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          values,
        }) => (
          <Form className="flex flex-col h-full max-h-[90dvh]">
            {console.log(errors, "Verify Form Error")}
            {/* Custom Header with Title and Close Button */}
            <div className="flex items-center justify-between pt-4 px-6 pb-4 flex-shrink-0">
              <div>
                <h2
                  className={`text-xl font-semibold ${
                    isDark ? "text-white" : "text-[#162230]"
                  }`}
                >
                  {nodeData?.name || "Node Configuration"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <CancelIcon theme={isDark ? "dark" : "light"} size={24} />
                </button>
              </div>
            </div>
            <div className="px-4 pb-2">
              <hr
                className={`border-t ${
                  isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
                }`}
              />
            </div>
            {/* Tabs */}
            <div className="px-6">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="gap-2"
                tabClassName="!py-1 !px-3 flex-1"
              />
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 mt-6 overflow-y-auto nodes-list-scrollbar min-h-0 pr-3 pl-7">
              {/* Data Tab Content */}
              {activeTab === "data" && (
                <div className="pb-4">
                  {/* Label Field */}
                  <div className="text-left w-full mb-4">
                    <h5 className="block text-sm md:text-base mb-1">Label</h5>
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
                          placeholder="Enter node label"
                          errors={errors}
                          touched={touched}
                          onFieldTouched={() => setFieldTouched("label", true)}
                          onFieldChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
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

                  {/* Config Schema Properties */}
                  {configSchema?.properties &&
                    Object.entries(configSchema.properties).map(
                      ([fieldName, property]) =>
                        renderField(
                          fieldName,
                          property as ConfigSchemaProperty,
                          errors,
                          touched,
                          setFieldValue,
                          setFieldTouched,
                          values
                        )
                    )}

                  {/* Show message if no config properties */}
                  {!configSchema?.properties && (
                    <div className="py-4 text-center">
                      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                        No additional configuration available for this node
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "dataInputs" && (
                <WorkflowPinsManager
                  pins={localInputs}
                  onPinsChange={setLocalInputs}
                  title="Input Pins"
                  pinType="input"
                  allowAdd={
                    configSchema?.metadata?.allow_custom_input_pins ?? true
                  }
                  defaultPinName="Input"
                  workflowId={workflowId}
                  nodeId={selectedNode?.id}
                />
              )}

              {activeTab === "dataOutputs" && (
                <WorkflowPinsManager
                  pins={localOutputs}
                  onPinsChange={setLocalOutputs}
                  title="Output Pins"
                  pinType="output"
                  allowAdd={
                    configSchema?.metadata?.allow_custom_output_pins ?? true
                  }
                  defaultPinName="Output"
                  workflowId={workflowId}
                  nodeId={selectedNode?.id}
                />
              )}

              {activeTab === "outPins" && (
                <WorkflowPinsManager
                  pins={localNextPins}
                  onPinsChange={setLocalNextPins}
                  title="Out Pins (Next)"
                  pinType="nextPin"
                  allowAdd={
                    configSchema?.metadata?.allow_custom_next_pins ?? true
                  }
                  defaultPinName="Pin"
                  workflowId={workflowId}
                  nodeId={selectedNode?.id}
                />
              )}
            </div>
            {/* Footer with Save Button - Only show for data tab */}
            {activeTab === "data" && (
              <div className="flex items-center justify-center gap-3 pt-4 px-6 pb-4 flex-shrink-0  dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="!px-6 !py-2 !rounded-md !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                >
                  Save
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default DatabaseNodeDialog;
