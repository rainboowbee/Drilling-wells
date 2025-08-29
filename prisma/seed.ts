import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Создаем админа
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  })

  // Создаем тестовые заявки
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        comment: 'Нужна скважина для полива участка 6 соток',
        status: 'PENDING',
      },
    }),
    prisma.application.create({
      data: {
        name: 'Мария Сидорова',
        phone: '+7 (999) 234-56-78',
        comment: 'Требуется вода для дома и бани',
        status: 'IN_PROGRESS',
      },
    }),
    prisma.application.create({
      data: {
        name: 'Алексей Козлов',
        phone: '+7 (999) 345-67-89',
        comment: 'Скважина на песок, участок в деревне',
        status: 'COMPLETED',
      },
    }),
  ])

  console.log({ admin, applications })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
