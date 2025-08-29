"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Navigation from "./components/Navigation";
import { useNotification } from "./hooks/useNotification";
import Notification from "./components/Notification";

// Иконки
const WellIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  
  const { 
    notification, 
    isVisible, 
    showSuccess, 
    showError, 
    showLoading, 
    hideLoading,
    hideNotification 
  } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Показываем уведомление о загрузке
    showLoading("Отправка заявки", "Пожалуйста, подождите...");
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Скрываем загрузку и показываем успех
        hideLoading();
        showSuccess(
          "Заявка отправлена!", 
          "Спасибо! Мы свяжемся с вами в ближайшее время.",
          6000
        );
        
        // Очищаем форму
        setFormData({ name: "", phone: "", comment: "" });
      } else {
        const errorData = await response.json();
        hideLoading();
        showError(
          "Ошибка отправки", 
          errorData.error || 'Не удалось отправить заявку. Попробуйте еще раз.',
          8000
        );
      }
    } catch (_) {
      hideLoading();
      showError(
        "Ошибка сети", 
        "Произошла ошибка при отправке заявки. Проверьте подключение к интернету.",
        8000
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
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
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        id="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6">
              <WellIcon />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Бурение абиссинских скважин и скважин на песок
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            Вода для вашего участка уже сегодня — быстро, чисто и без техники
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform"
          >
            Заказать бурение
          </motion.button>
        </div>
      </motion.section>

      {/* Что такое абиссинская скважина */}
      <motion.section 
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl">
                  <WellIcon />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Что такое абиссинская скважина
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                Абиссинская скважина — это компактный источник воды, представляющий собой трубу с фильтром, 
                которая устанавливается в водоносный песчаный слой.
              </p>
              <div className="space-y-4">
                {[
                  "Установка за 1 день",
                  "Без тяжелой техники", 
                  "Чистая вода для полива и хозяйства",
                  "Дешевле колодца и глубокой скважины"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                    <Image
                      src="/diploma.png"
                      alt="Диплом, подтверждающий квалификацию"
                      width={300}
                      height={200}
                      className="w-full h-full object-contain rounded-2xl shadow-lg"
                      priority
                    />
                
                
                {/* Информация о районе работы */}
                <div className="mt-4 bg-gradient-to-r from-blue-100 to-cyan-200 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-blue-800 font-semibold">Работаем в Переславском районе</span>
                  </div>
                  <p className="text-sm text-blue-700">Бурение скважин в Переславле-Залесском и окрестностях</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Преимущества услуги */}
      <motion.section 
        id="advantages"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 leading-tight"
          >
            Преимущества нашей услуги
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                title: "Чистота",
                description: "Без грязи и кубов вынутого грунта",
                icon: "🧹",
                color: "from-green-100 to-emerald-200"
              },
              {
                title: "Быстрота",
                description: "Подключение насоса в день бурения — бесплатно",
                icon: "⚡",
                color: "from-yellow-100 to-orange-200"
              },
              {
                title: "Экологичность",
                description: "Используем экологичные материалы (ПНД-трубы, фильтры)",
                icon: "🌱",
                color: "from-emerald-100 to-green-200"
              },
              {
                title: "Универсальность",
                description: "Идеально подходит для полива и водоснабжения дома",
                icon: "🏠",
                color: "from-blue-100 to-cyan-200"
              }
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100 card-hover"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${advantage.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl sm:text-4xl`}>
                  {advantage.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Стоимость и условия */}
      <motion.section 
        id="pricing"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-16 leading-tight"
          >
            Простая и прозрачная цена
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden"
          >
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full -mr-16 -mt-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300 rounded-full -ml-12 -mb-12 opacity-20"></div>
            
            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-600 mb-4">
                30 000 ₽
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 font-medium">
                Бурение до 10 м со всеми материалами
              </p>
              <div className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 font-medium">
                +1 500 ₽ за каждый дополнительный метр
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-sm sm:text-base text-gray-700 border border-white/50">
                <p className="font-medium">Уточнение: разведочное бурение, если нет песков до 12 м или дебет &lt; 400 л/ч.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Гарантия */}
      <motion.section 
        id="guarantee"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8"
          >
            <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl shadow-lg">
              <ShieldIcon />
            </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Гарантия 2 года
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Мы уверены в качестве и даем официальную гарантию на все выполненные работы.
          </motion.p>
        </div>
      </motion.section>

      {/* Контакты / Форма заявки */}
      <motion.section 
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 leading-tight"
          >
            О нас и наши преимущества
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Форма */}
            <motion.form
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100"
            >
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white form-input"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white form-input"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
              <div className="mb-8">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white resize-none form-input"
                  placeholder="Дополнительная информация о вашем участке или требованиях"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform btn-primary"
              >
                Отправить заявку
              </motion.button>
            </motion.form>

            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-blue-100 to-cyan-200 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Почему выбирают нас</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>✓ Опыт более 10 лет</p>
                  <p>✓ Гарантия качества</p>
                  <p>✓ Работаем без предоплаты</p>
                  <p>✓ Выезд в день обращения</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <WellIcon />
            </div>
            <h3 className="text-2xl font-bold mb-2">Бурение скважин</h3>
            <p className="text-gray-400">Качественно, быстро, надежно</p>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400">
              © 2024 Бурение скважин. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
