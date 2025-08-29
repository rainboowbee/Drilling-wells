import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'loading';

interface NotificationData {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = useCallback((data: NotificationData) => {
    setNotification(data);
    setIsVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
    // Небольшая задержка для анимации выхода
    setTimeout(() => {
      setNotification(null);
    }, 300);
  }, []);

  const showSuccess = useCallback((title: string, message?: string, duration = 5000) => {
    showNotification({ type: 'success', title, message, duration });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string, duration = 5000) => {
    showNotification({ type: 'error', title, message, duration });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string, duration = 5000) => {
    showNotification({ type: 'info', title, message, duration });
  }, [showNotification]);

  const showLoading = useCallback((title: string, message?: string) => {
    showNotification({ type: 'loading', title, message, duration: 0 });
  }, [showNotification]);

  const hideLoading = useCallback(() => {
    hideNotification();
  }, [hideNotification]);

  return {
    notification,
    isVisible,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showLoading,
    hideLoading
  };
}
