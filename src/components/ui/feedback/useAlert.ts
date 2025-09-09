"use client";
import { useState, useCallback } from "react";
import { AlertType } from "./Alert";

interface AlertState {
  type: AlertType;
  title?: string;
  message: string;
  isVisible: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
  type: "info",
  message: "",
  isVisible: false
  });

  const showAlert = useCallback((
  type: AlertType,
  message: string,
  options?: {
  title?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  }) =>
  {
  setAlert({
  type,
  message,
  title: options?.title,
  isVisible: true,
  autoClose: options?.autoClose ?? true,
  autoCloseDelay: options?.autoCloseDelay ?? 5000
  });
  }, []);

  const hideAlert = useCallback(() => {
  setAlert((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showSuccess = useCallback((message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => {
  showAlert("success", message, options);
  }, [showAlert]);

  const showError = useCallback((message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => {
  showAlert("error", message, options);
  }, [showAlert]);

  const showWarning = useCallback((message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => {
  showAlert("warning", message, options);
  }, [showAlert]);

  const showInfo = useCallback((message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => {
  showAlert("info", message, options);
  }, [showAlert]);

  return {
  alert,
  showAlert,
  hideAlert,
  showSuccess,
  showError,
  showWarning,
  showInfo
  };
};

export default useAlert;