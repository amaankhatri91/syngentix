import React from "react";

export type IconPosition = "prefix" | "suffix";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button text content
   */
  children?: React.ReactNode;
  /**
   * Icon to display in the button (React node, component, or string)
   */
  icon?: React.ReactNode;
  /**
   * Position of the icon relative to the text
   * @default "prefix"
   */
  iconPosition?: IconPosition;
  /**
   * Custom width class (e.g., "w-32", "w-full", "w-auto")
   * @default "w-auto"
   */
  width?: string;
  /**
   * Custom height class (e.g., "h-10", "h-12", "h-14")
   * @default "h-10"
   */
  height?: string;
  /**
   * Background color class (e.g., "bg-blue-500", "bg-gradient-to-r from-purple-600 to-blue-600")
   */
  backgroundColor?: string;
  /**
   * Additional CSS classes for the button
   */
  className?: string;
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Custom icon size (applies to icon if it's a React component that accepts size prop)
   */
  iconSize?: number | string;
  /**
   * Custom icon color (applies to icon if it's a React component that accepts color prop)
   */
  iconColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  iconPosition = "prefix",
  width = "w-auto",
  height = "h-auto",
  backgroundColor = "",
  className = "",
  loading = false,
  iconSize,
  iconColor,
  disabled,
  onClick,
  ...rest
}) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";

  // Render icon with optional size and color props
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a React element, clone it with size/color props if applicable
    if (React.isValidElement(icon)) {
      const iconProps: Record<string, any> = {};
      
      // Check if the icon component accepts size prop
      if (iconSize !== undefined) {
        iconProps.size = iconSize;
      }
      
      // Check if the icon component accepts color prop
      if (iconColor !== undefined) {
        iconProps.color = iconColor;
      }

      // Only add props if they exist
      if (Object.keys(iconProps).length > 0) {
        return React.cloneElement(icon, iconProps);
      }
    }

    return icon;
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={`
        ${baseStyles}
        ${backgroundColor}
        ${width}
        ${height}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      disabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && iconPosition === "prefix" && renderIcon()}
      {children && <div className="font-normal">{children}</div>}
      {!loading && iconPosition === "suffix" && renderIcon()}
    </button>
  );
};

export default Button;

