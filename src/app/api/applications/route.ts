import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST - создание новой заявки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, comment } = body

    // Валидация
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      )
    }

    // Создание заявки
    const application = await prisma.application.create({
      data: {
        name,
        phone,
        comment: comment || null,
      },
    })

    return NextResponse.json(
      { 
        message: 'Заявка успешно создана', 
        application 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Ошибка при создании заявки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// GET - получение всех заявок (только для админов)
export async function GET(_unused: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
    }

    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Ошибка при получении заявок:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
