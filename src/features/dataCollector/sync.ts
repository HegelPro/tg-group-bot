import { prisma } from '../../db'
import { Chat, User } from 'grammy/types'

export const syncTelegramChat = async (chatId: number, chat: Chat) =>
  await prisma.telegramChat.upsert({
    where: {
      id: chatId,
    },
    update: chat,
    create: chat,
  })

export const syncTelegramUser = async (telegramUserId: number, user: User) =>
  await prisma.telegramUser.upsert({
    where: {
      id: telegramUserId,
    },
    update: user,
    create: user,
  })
