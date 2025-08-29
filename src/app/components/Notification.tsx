"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const notificationStyles = {
  success: {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900'
  },
  error: {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900'
  },
  info: {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900'
  },
  loading: {
    icon: (
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
    ),
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900'
  }
};

export default function Notification({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000
}: NotificationProps) {
  const styles = notificationStyles[type];

  useEffect(() => {
    if (isVisible && type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, type, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="fixed top-4 md:bottom-4 left-2 right-2 md:left-auto md:right-4 z-50 w-auto md:max-w-sm"
        >
          <motion.div
            initial={{ x: 300, y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: 300, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`${styles.bgColor} ${styles.borderColor} border rounded-xl shadow-lg p-4 backdrop-blur-sm`}
          >
            <div className="flex items-start space-x-3">
              {/* Иконка */}
              <div className={`${styles.iconColor} flex-shrink-0 mt-0.5`}>
                {styles.icon}
              </div>

              {/* Контент */}
              <div className="flex-1 min-w-0">
                <h3 className={`${styles.titleColor} text-sm font-semibold`}>
                  {title}
                </h3>
                {message && (
                  <p className={`${styles.textColor} text-sm mt-1`}>
                    {message}
                  </p>
                )}
              </div>

              {/* Кнопка закрытия */}
              {type !== 'loading' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`${styles.textColor} hover:${styles.iconColor} transition-colors flex-shrink-0`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Прогресс-бар для автоматического закрытия */}
            {type !== 'loading' && duration > 0 && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`h-1 ${styles.iconColor} rounded-full mt-3`}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
