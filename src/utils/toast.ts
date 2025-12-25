import { toast, ToastOptions } from "react-toastify";

/**
 * Toast utility functions with theme-aware styling
 * These functions automatically use the theme colors defined in the app
 */

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Show a success toast notification
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show an error toast notification
 * Filters out RTK Query internal errors that shouldn't be shown to users
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  // Filter out RTK Query internal errors
  const filteredMessages = [
    "cannot fetch query that has not been started yet",
    "Cannot fetch query that has not been started yet",
  ];
  
  if (filteredMessages.some((filtered) => message?.toLowerCase().includes(filtered.toLowerCase()))) {
    // Don't show RTK Query internal errors
    return;
  }
  
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show an info toast notification
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a warning toast notification
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a default toast notification
 */
export const showToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Dismiss a toast by its ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};


