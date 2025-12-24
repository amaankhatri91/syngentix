import React, { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import useTheme from "@/utils/hooks/useTheme";
import { searchIcon } from "@/utils/logoUtils";

export interface SearchInputProps {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Callback function called when the search value changes (debounced)
   */
  onSearch?: (value: string) => void;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceDelay?: number;
  /**
   * Initial value for the input
   */
  defaultValue?: string;
  /**
   * Controlled value for the input
   */
  value?: string;
  /**
   * Callback function called on every input change (not debounced)
   */
  onChange?: (value: string) => void;
  /**
   * Custom width class (e.g., "w-60", "w-full")
   * @default "w-60"
   */
  width?: string;
  /**
   * Custom height class (e.g., "h-10", "h-12")
   * @default "h-10"
   */
  height?: string;
  /**
   * Additional CSS classes for the input container
   */
  className?: string;
  /**
   * Additional CSS classes for the input element
   */
  inputClassName?: string;
  /**
   * Whether to show the search icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom icon source (overrides default search icon)
   */
  iconSrc?: string;
  /**
   * Disable the input
   */
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search for...",
  onSearch,
  debounceDelay = 300,
  defaultValue = "",
  value: controlledValue,
  onChange,
  width = "w-60",
  height = "h-10",
  className = "",
  inputClassName = "",
  showIcon = true,
  iconSrc,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue ?? defaultValue
  );

  // Use controlled value if provided, otherwise use internal state
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Debounced callback for onSearch
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      if (onSearch) {
        onSearch(value);
      }
    },
    debounceDelay
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Update internal state if not controlled
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      // Call onChange immediately (not debounced)
      if (onChange) {
        onChange(newValue);
      }

      // Call debounced onSearch
      debouncedSearch(newValue);
    },
    [controlledValue, onChange, debouncedSearch]
  );

  const iconSource = iconSrc || searchIcon();

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        style={{
          border: theme === "light" ? "0.6px solid #B7C0CF" : "none",
        }}
        className={`
          ${width} ${height} px-4 ${showIcon ? "pl-10" : "pl-4"}
          bg-white rounded-lg
          text-gray-900 placeholder-gray-600
          outline-none
          focus:outline-none
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${inputClassName}
        `}
      />
      {showIcon && (
        <img
          src={iconSource}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none"
          alt="search"
        />
      )}
    </div>
  );
};

export default SearchInput;

