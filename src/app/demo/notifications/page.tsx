"use client";

import { motion } from 'framer-motion';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../../components/Notification';
import Link from 'next/link';

export default function NotificationsDemo() {
  const { 
    notification, 
    isVisible, 
    showSuccess, 
    showError, 
    showInfo, 
    showLoading, 
    hideLoading,
    hideNotification 
  } = useNotification();

  const handleShowSuccess = () => {
    showSuccess("Успешно!", "Операция выполнена успешно", 5000);
  };

  const handleShowError = () => {
    showError("Ошибка!", "Что-то пошло не так", 5000);
  };

  const handleShowInfo = () => {
    showInfo("Информация", "Это информационное сообщение", 5000);
  };

  const handleShowLoading = () => {
    showLoading("Загрузка", "Пожалуйста, подождите...");
    // Автоматически скрываем через 3 секунды
    setTimeout(() => {
      hideLoading();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      {/* Уведомления */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={isVisible}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Демо уведомлений
          </h1>
          <p className="text-xl text-gray-600">
            Тестируйте различные типы уведомлений
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Успех */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowSuccess}
            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl shadow-lg transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold">Успех</h3>
              <p className="text-sm opacity-90">Показать уведомление об успехе</p>
            </div>
          </motion.button>

          {/* Ошибка */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowError}
            className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-xl shadow-lg transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="font-semibold">Ошибка</h3>
              <p className="text-sm opacity-90">Показать уведомление об ошибке</p>
            </div>
          </motion.button>

          {/* Информация */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowInfo}
            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl shadow-lg transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Информация</h3>
              <p className="text-sm opacity-90">Показать информационное уведомление</p>
            </div>
          </motion.button>

          {/* Загрузка */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowLoading}
            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-xl shadow-lg transition-colors"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
              <h3 className="font-semibold">Загрузка</h3>
              <p className="text-sm opacity-90">Показать уведомление о загрузке</p>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Вернуться на главную
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
