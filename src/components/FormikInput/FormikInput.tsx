import React from "react";
import { Input } from "@material-tailwind/react";
import useTheme from "@/utils/hooks/useTheme";

export interface FormikInputProps
  extends Omit<React.ComponentProps<typeof Input>, "error"> {
  /**
   * Field name from Formik
   */
  field: {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
  /**
   * Formik errors object
   */
  errors?: any;
  /**
   * Formik touched object
   */
  touched?: any;
  /**
   * Whether to show error state
   */
  showError?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback when field is touched
   */
  onFieldTouched?: () => void;
  /**
   * Callback when field value changes
   */
  onFieldChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormikInput: React.FC<FormikInputProps> = ({
  field,
  errors,
  touched,
  showError,
  className = "",
  onFieldTouched,
  onFieldChange,
  ...props
}) => {
  const { isDark } = useTheme();
  const fieldName = field.name;
  const hasError =
    showError !== undefined
      ? showError
      : errors?.[fieldName] && touched?.[fieldName];

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(e);
    if (onFieldTouched) {
      onFieldTouched();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    if (onFieldChange) {
      onFieldChange(e);
    }
  };

  return (
    <Input
      {...field}
      {...props}
      className={`
        !border ${hasError ? "!border-red-500" : isDark ? "!border-[#2B3643]" : "!border-[#E3E6EB]"}
        ${!isDark && !hasError ? "!border-t-[#EAEAEA]" : ""}
        ${!isDark && !hasError ? "shadow-[0_4px_8px_0_rgba(1,5,17,0.1)]" : ""}
        ${isDark ? "!bg-[#0F141D]" : "!bg-white"}
        !rounded-md
        ${isDark ? "!text-white" : "!text-[#162230]"}
        [&::placeholder]:opacity-100
        [&::placeholder]:!text-[#A1A1A1]
        [&:focus::placeholder]:opacity-100
        [&:not(:placeholder-shown)::placeholder]:opacity-100
        [&_input::placeholder]:opacity-100
        [&_input::placeholder]:!text-[#A1A1A1]
        [&_input:focus::placeholder]:opacity-100
        [&_input:not(:placeholder-shown)::placeholder]:opacity-100
        ${className}
      `}
      labelProps={{
        className: "hidden",
      }}
      containerProps={{
        className: "[&_label]:hidden",
      }}
      error={!!hasError}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default FormikInput;
