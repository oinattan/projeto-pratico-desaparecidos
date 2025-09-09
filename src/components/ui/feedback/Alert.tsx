"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { createPortal } from 'react-dom';

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  className = ""
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
  }, []);

  React.useEffect(() => {
  if (isVisible && autoClose) {
  const timer = setTimeout(() => {
    onClose();
  }, autoCloseDelay);

  return () => clearTimeout(timer);
  }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  const alertConfig = {
  success: {
  icon: CheckCircle,
  bgColor: "bg-green-50 dark:bg-green-900/20",
  borderColor: "border-green-200 dark:border-green-800",
  iconColor: "text-green-600 dark:text-green-400",
  titleColor: "text-green-800 dark:text-green-200",
  messageColor: "text-green-700 dark:text-green-300",
  closeColor: "text-green-400 hover:text-green-600 dark:hover:text-green-300"
  },
  error: {
  icon: XCircle,
  bgColor: "bg-red-50 dark:bg-red-900/20",
  borderColor: "border-red-200 dark:border-red-800",
  iconColor: "text-red-600 dark:text-red-400",
  titleColor: "text-red-800 dark:text-red-200",
  messageColor: "text-red-700 dark:text-red-300",
  closeColor: "text-red-400 hover:text-red-600 dark:hover:text-red-300"
  },
  warning: {
  icon: AlertTriangle,
  bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  borderColor: "border-yellow-200 dark:border-yellow-800",
  iconColor: "text-yellow-600 dark:text-yellow-400",
  titleColor: "text-yellow-800 dark:text-yellow-200",
  messageColor: "text-yellow-700 dark:text-yellow-300",
  closeColor: "text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300"
  },
  info: {
  icon: Info,
  bgColor: "bg-blue-50 dark:bg-blue-900/20",
  borderColor: "border-blue-200 dark:border-blue-800",
  iconColor: "text-blue-600 dark:text-blue-400",
  titleColor: "text-blue-800 dark:text-blue-200",
  messageColor: "text-blue-700 dark:text-blue-300",
  closeColor: "text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
  }
  };

  const config = alertConfig[type];
  const IconComponent = config.icon;

  if (!mounted) return null;

  const alertNode =
  <AnimatePresence>
  {isVisible &&
  <motion.div
  initial={{ opacity: 0, y: -20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -20, scale: 0.95 }}
  transition={{ duration: 0.3 }}
  className={`
        fixed top-3 right-3 left-3 sm:left-auto z-[10002] max-w-sm sm:max-w-md w-full sm:w-auto mx-auto sm:mx-0
        ${config.bgColor} ${config.borderColor}
        border rounded-md sm:rounded-lg shadow-lg p-2 sm:p-4 text-xs sm:text-sm
        ${className}
      `}>
  
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          {title &&
      <h3 className={`text-xs sm:text-sm font-medium ${config.titleColor} mb-1`}>
              {title}
            </h3>
      }
          <p className={`text-xs sm:text-sm ${config.messageColor} whitespace-pre-line break-words`}>
            {message}
          </p>
        </div>

        <button
      onClick={onClose}
      className={`flex-shrink-0 ${config.closeColor} transition-colors p-1 ml-1`}>
      
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {}
      {autoClose &&
  <motion.div
    className="absolute bottom-0 left-0 h-0.5 bg-current opacity-20 rounded-b-md"
    initial={{ width: "100%" }}
    animate={{ width: "0%" }}
    transition={{ duration: autoCloseDelay / 1000, ease: "linear" }} />

  }
    </motion.div>
  }
  </AnimatePresence>;

  return createPortal(alertNode, document.body);
};

export default Alert;