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
import PlusIcon from "@/assets/app-icons/PlusIcon";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import useTheme from "@/utils/hooks/useTheme";
import { useAppSelector } from "@/store";
import { Node } from "reactflow";
import { CustomNodeData, NodePin } from "./type";

interface DatabaseNodeDialogProps {
  open?: boolean;
  handler?: () => void;
  nodesData?: any;
  nodesLoading?: boolean;
  nodesError?: any;
  selectedNode?: any | null;
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
}: DatabaseNodeDialogProps) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string | number>("data");
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log(selectedNode, "Verify Selected Nodes");

  // Get node data
  const nodeData = useMemo(() => {
    return selectedNode?.node;
  }, [selectedNode]);

  // Get config schema from selected node
  const configSchema = useMemo(() => {
    return nodeData?.config_schema;
  }, [nodeData]);

  // Get pins data
  const inputs = useMemo(() => nodeData?.inputs || [], [nodeData]);
  const outputs = useMemo(() => nodeData?.outputs || [], [nodeData]);
  const nextPins = useMemo(() => nodeData?.next_pins || [], [nodeData]);
  const triggerPins = useMemo(() => nodeData?.trigger_pins || [], [nodeData]);

  // State for managing pins (for adding/removing)
  const [localInputs, setLocalInputs] = useState<NodePin[]>(inputs);
  const [localOutputs, setLocalOutputs] = useState<NodePin[]>(outputs);
  const [localNextPins, setLocalNextPins] = useState<NodePin[]>(nextPins);

  // Update local state when nodeData changes
  React.useEffect(() => {
    setLocalInputs(inputs);
    setLocalOutputs(outputs);
    setLocalNextPins(nextPins);
  }, [inputs, outputs, nextPins]);

  // Generate initial values from config schema
  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};

    if (configSchema?.properties) {
      Object.entries(configSchema.properties).forEach(([key, prop]) => {
        const property = prop as ConfigSchemaProperty;
        if (property.default !== undefined) {
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
  }, [configSchema]);

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
    const hasError = errors?.[fieldName] && touched?.[fieldName];

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
      size="xs"
      bodyClassName="!p-0"
      disableOuterScroll={true}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            console.log("Node Configuration values:", values);
            if (handler) {
              handler();
            }
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
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Node Properties
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="!px-4 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                >
                  Save
                </Button>
                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                >
                  <CancelIcon theme={isDark ? "dark" : "light"} size={24} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="flex-wrap"
                tabClassName="py-1"
              />
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto nodes-list-scrollbar min-h-0 px-6">
              {/* Data Tab Content */}
              {activeTab === "data" && configSchema?.properties && (
                <div className="space-y-4 pb-4">
                  {Object.entries(configSchema.properties).map(
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
                </div>
              )}

              
              {activeTab === "data" && !configSchema?.properties && (
                <div className="py-8 text-center">
                  <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                    No configuration available for this node
                  </p>
                </div>
              )}
              
              {activeTab === "dataInputs" && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-[#162230]"
                      }`}
                    >
                      Input Pins
                    </h3>
                    <Button
                      type="button"
                      onClick={() => {
                        const newPin: NodePin = {
                          id: `input-${Date.now()}`,
                          name: "Connection",
                          type: "any",
                          required: false,
                          custom: true,
                        };
                        setLocalInputs([...localInputs, newPin]);
                      }}
                      icon={<PlusIcon />}
                      className="!px-3 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                    >
                      Add Input
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {localInputs.map((pin, index) => (
                      <div
                        key={pin.id || index}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isDark
                            ? "bg-[#0F141D] border-[#2B3643]"
                            : "bg-white border-[#E3E6EB] shadow-sm"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-[#162230]"
                              }`}
                            >
                              {pin.name}
                            </span>
                            <span
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Default
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={`p-1.5 rounded hover:bg-opacity-10 ${
                              isDark ? "hover:bg-white" : "hover:bg-gray-200"
                            } transition-colors`}
                            title="Attach connection"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 2L6 4H4C3.44772 4 3 4.44772 3 5V11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11V5C13 4.44772 12.5523 4 12 4H10L8 2Z"
                                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalInputs(
                                localInputs.filter((_, i) => i !== index)
                              );
                            }}
                            className={`p-1.5 rounded hover:bg-opacity-10 ${
                              isDark ? "hover:bg-white" : "hover:bg-gray-200"
                            } transition-colors`}
                            title="Delete"
                          >
                            <DeleteIcon
                              height={16}
                              color={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                          </button>
                        </div>
                      </div>
                    ))}

                    {localInputs?.length === 0 && (
                      <p
                        className={`text-sm text-center py-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No input pins
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "dataOutputs" && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-[#162230]"
                      }`}
                    >
                      Output Pins
                    </h3>
                    <Button
                      type="button"
                      onClick={() => {
                        const newPin: NodePin = {
                          id: `output-${Date.now()}`,
                          name: "Output",
                          type: "any",
                          required: false,
                          custom: true,
                        };
                        setLocalOutputs([...localOutputs, newPin]);
                      }}
                      icon={<PlusIcon />}
                      className="!px-3 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                    >
                      Add Output
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {localOutputs.map((pin, index) => (
                      <div
                        key={pin.id || index}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isDark
                            ? "bg-[#0F141D] border-[#2B3643]"
                            : "bg-white border-[#E3E6EB] shadow-sm"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-[#162230]"
                              }`}
                            >
                              {pin.name}
                            </span>
                            <span
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Default
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={`p-1.5 rounded hover:bg-opacity-10 ${
                              isDark ? "hover:bg-white" : "hover:bg-gray-200"
                            } transition-colors`}
                            title="Attach connection"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 2L6 4H4C3.44772 4 3 4.44772 3 5V11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11V5C13 4.44772 12.5523 4 12 4H10L8 2Z"
                                stroke={isDark ? "#9CA3AF" : "#6B7280"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalOutputs(
                                localOutputs.filter((_, i) => i !== index)
                              );
                            }}
                            className={`p-1.5 rounded hover:bg-opacity-10 ${
                              isDark ? "hover:bg-white" : "hover:bg-gray-200"
                            } transition-colors`}
                            title="Delete"
                          >
                            <DeleteIcon
                              height={16}
                              color={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                    {localOutputs.length === 0 && (
                      <p
                        className={`text-sm text-center py-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No output pins
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "outPins" && (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-[#162230]"
                      }`}
                    >
                      Out Pins (Next)
                    </h3>
                    {configSchema?.metadata?.allow_custom_next_pins && (
                      <Button
                        type="button"
                        onClick={() => {
                          const newPin: NodePin = {
                            id: `next-${Date.now()}`,
                            name: "Next",
                            type: "any",
                            required: false,
                            custom: true,
                          };
                          setLocalNextPins([...localNextPins, newPin]);
                        }}
                        icon={<PlusIcon />}
                        className="!px-3 !py-2 !rounded-lg !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
                      >
                        Add Pin
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {localNextPins.map((pin, index) => (
                      <div
                        key={pin.id || index}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isDark
                            ? "bg-[#0F141D] border-[#2B3643]"
                            : "bg-white border-[#E3E6EB] shadow-sm"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${
                                isDark ? "text-white" : "text-[#162230]"
                              }`}
                            >
                              {pin.name}
                            </span>
                            <span
                              className={`text-xs ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Default
                            </span>
                          </div>
                        </div>
                        {pin.custom && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={`p-1.5 rounded hover:bg-opacity-10 ${
                                isDark ? "hover:bg-white" : "hover:bg-gray-200"
                              } transition-colors`}
                              title="Attach connection"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 2L6 4H4C3.44772 4 3 4.44772 3 5V11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11V5C13 4.44772 12.5523 4 12 4H10L8 2Z"
                                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalNextPins(
                                  localNextPins.filter((_, i) => i !== index)
                                );
                              }}
                              className={`p-1.5 rounded hover:bg-opacity-10 ${
                                isDark ? "hover:bg-white" : "hover:bg-gray-200"
                              } transition-colors`}
                              title="Delete"
                            >
                              <DeleteIcon
                                height={16}
                                color={isDark ? "#9CA3AF" : "#6B7280"}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {localNextPins.length === 0 && (
                      <p
                        className={`text-sm text-center py-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No out pins
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default DatabaseNodeDialog;
