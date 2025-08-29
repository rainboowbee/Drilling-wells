import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// PATCH - обновление статуса заявки
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Неверный ID заявки' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body

    // Валидация статуса
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Неверный статус' },
        { status: 400 }
      )
    }

    // Обновление заявки
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      message: 'Статус заявки обновлен',
      application
    })
  } catch (error) {
    console.error('Ошибка при обновлении заявки:', error)
    
    // Обработка специфических ошибок Prisma
    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json(
          { error: 'Заявка не найдена' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE - удаление заявки
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Неверный ID заявки' },
        { status: 400 }
      )
    }

    await prisma.application.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Заявка удалена'
    })
  } catch (error) {
    console.error('Ошибка при удалении заявки:', error)
    
    // Обработка специфических ошибок Prisma
    if (error instanceof Error) {
      if (error.message.includes('P2025')) {
        return NextResponse.json(
          { error: 'Заявка не найдена' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
