import React from "react";
import { Button } from "@/components/Button";
import useTheme from "@/utils/hooks/useTheme";

export interface FooterButtonsProps {
  /**
   * Cancel button click handler
   */
  onCancel?: () => void;
  /**
   * Submit button click handler (if not provided, button will be type="submit")
   */
  onSubmit?: () => void;
  /**
   * Cancel button text
   * @default "Cancel"
   */
  cancelText?: string;
  /**
   * Submit button text
   * @default "Submit"
   */
  submitText?: string;
  /**
   * Whether the submit button is in loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether the submit button is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
  /**
   * Whether to show cancel button
   * @default true
   */
  showCancel?: boolean;
  /**
   * Whether to show submit button
   * @default true
   */
  showSubmit?: boolean;
  /**
   * Custom submit button type
   * @default "submit"
   */
  submitType?: "button" | "submit";
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isLoading = false,
  isDisabled = false,
  className = "",
  showCancel = true,
  showSubmit = true,
  submitType = "submit",
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex justify-end gap-3 w-full pt-4 ${className}`}>
      {showCancel && (
        <Button
          type="button"
          onClick={onCancel}
          style={
            isDark
              ? {
                  background:
                    "linear-gradient(96.79deg, #171717 -62.94%, #323335 -62.92%, rgba(90, 90, 90, 0) 54.42%, #171717 174.24%)",
                }
              : undefined
          }
          backgroundColor={
            isDark
              ? "text-white border border-[#2B3643]"
              : "bg-[#E6E6E6] hover:bg-gray-300 text-gray-900"
          }
          width="w-full"
          className="px-6 !rounded-xl !py-2"
        >
          {cancelText}
        </Button>
      )}
      {showSubmit && (
        <Button
          type={submitType}
          onClick={onSubmit}
          disabled={isDisabled || isLoading}
          backgroundColor="!bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-white"
          width="w-full"
          className="px-6 !rounded-xl !py-2"
          loading={isLoading}
        >
          {submitText}
        </Button>
      )}
    </div>
  );
};

export default FooterButtons;






