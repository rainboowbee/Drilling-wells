#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log('🚀 Создание администратора для админ-панели\n');
    
    // Запрашиваем данные администратора
    const name = await question('Имя администратора: ');
    const email = await question('Email: ');
    const password = await question('Пароль: ');
    const confirmPassword = await question('Подтвердите пароль: ');
    
    // Проверяем пароли
    if (password !== confirmPassword) {
      console.log('❌ Пароли не совпадают!');
      rl.close();
      return;
    }
    
    if (password.length < 6) {
      console.log('❌ Пароль должен быть не менее 6 символов!');
      rl.close();
      return;
    }
    
    console.log('\n⏳ Создание администратора...');
    
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('⚠️  Пользователь с таким email уже существует!');
      console.log('Обновляем роль на ADMIN...');
      
      await prisma.user.update({
        where: { email },
        data: { 
          role: 'ADMIN',
          name: name || existingUser.name
        }
      });
      
      console.log('✅ Роль пользователя обновлена на ADMIN!');
    } else {
      // Создаем нового администратора
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Администратор успешно создан!');
    }
    
    console.log('\n📋 Данные для входа:');
    console.log(`Email: ${email}`);
    console.log(`Пароль: ${password}`);
    console.log('\n🔗 Ссылки:');
    console.log(`Вход: http://localhost:3001/auth/signin`);
    console.log(`Админка: http://localhost:3001/admin`);
    
  } catch (error) {
    console.error('❌ Ошибка при создании администратора:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Запускаем скрипт
createAdmin();
