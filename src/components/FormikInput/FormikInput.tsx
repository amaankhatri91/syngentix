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
        !border ${hasError ? "!border-red-500" : "!border-gray-300"}
        !bg-white
        !rounded-xl
        ${isDark ? "!text-gray-900" : "!text-gray-900"}
        [&::placeholder]:opacity-100
        [&::placeholder]:text-gray-400
        [&:focus::placeholder]:opacity-100
        [&:not(:placeholder-shown)::placeholder]:opacity-100
        [&_input::placeholder]:opacity-100
        [&_input::placeholder]:text-gray-400
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
