"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

interface Application {
  id: string;
  name: string;
  phone: string;
  comment?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Завершено',
  CANCELLED: 'Отменено',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { 
    notification, 
    isVisible, 
    showSuccess, 
    showError, 
    showLoading, 
    hideLoading,
    hideNotification 
  } = useNotification();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    fetchApplications();
  }, [session, status, router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Ошибка при загрузке заявок');
      }
    } catch (_unused) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Application['status']) => {
    showLoading("Обновление статуса", "Пожалуйста, подождите...");
    
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status } : app
          )
        );
        hideLoading();
        showSuccess(
          "Статус обновлен", 
          `Статус заявки успешно изменен на "${statusLabels[status]}"`,
          4000
        );
      } else {
        hideLoading();
        showError("Ошибка обновления", "Не удалось обновить статус заявки");
      }
    } catch (_unused) { // eslint-disable-line @typescript-eslint/no-unused-vars
      hideLoading();
      showError("Ошибка сети", "Произошла ошибка при обновлении статуса");
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    showLoading("Удаление заявки", "Пожалуйста, подождите...");
    
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        hideLoading();
        showSuccess("Заявка удалена", "Заявка успешно удалена из системы", 4000);
      } else {
        hideLoading();
        showError("Ошибка удаления", "Не удалось удалить заявку");
      }
    } catch (_unused) { // eslint-disable-line @typescript-eslint/no-unused-vars
      hideLoading();
      showError("Ошибка сети", "Произошла ошибка при удалении заявки");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Номер скопирован", "Номер телефона скопирован в буфер обмена", 3000);
    } catch (_unused) { // eslint-disable-line @typescript-eslint/no-unused-vars
      showError("Ошибка копирования", "Не удалось скопировать номер телефона");
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
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

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Заголовок с информацией о пользователе */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Админ-панель
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Управление заявками на бурение скважин
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Вы вошли как</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">{session.user.name}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200"
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full ${statusColors[status as keyof typeof statusColors]} mb-2 lg:mb-3`}>
                      <span className="text-base lg:text-lg font-semibold">{count}</span>
                    </div>
                    <h3 className="text-xs lg:text-sm font-medium text-gray-900">{label}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Список заявок в виде карточек */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Все заявки ({applications.length})
              </h2>
            </div>
            
            {/* Карточки заявок */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {applications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Заголовок карточки */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                          {application.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{application.name}</h3>
                          <button
                            onClick={() => copyToClipboard(application.name)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Скопировать имя"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Статус */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={application.status}
                        onChange={(e) => updateStatus(application.id, e.target.value as Application['status'])}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${statusColors[application.status]}`}
                      >
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <option key={status} value={status}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Контактная информация */}
                  <div className="mb-2 sm:mb-3">
                    <div className="flex items-center justify-between">
                      <a 
                        href={`tel:${application.phone}`}
                        className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group flex-1"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium group-hover:text-blue-600 transition-colors">{application.phone}</span>
                      </a>
                      
                      <button
                        onClick={() => copyToClipboard(application.phone)}
                        className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Скопировать номер"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Комментарий */}
                  {application.comment && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-start space-x-2">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          {application.comment}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Действия */}
                  <div className="flex justify-end pt-2 sm:pt-3 border-t border-gray-200">
                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Удалить</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
