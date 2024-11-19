import { prisma } from './db'

export const getChatInfos = () => prisma.chatInfo.findMany()

export const getChatInfo = (chatId: number) =>
  prisma.chatInfo.findFirst({
    where: {
      id: chatId,
    },
  })

export const getMessages = (chatId: number) =>
  prisma.messageEvent.findMany({
    where: {
      chat_id: chatId,
    },
  })

export const getMessage = (chatId: number) => (messageId: number) =>
  prisma.messageEvent.findFirst({
    where: {
      chat_id: chatId,
      id: messageId,
    },
  })

export const getMembers = (chatId: number) =>
  prisma.member.findMany({
    where: {
      chatInfo: {
        id: chatId,
      },
    },
  })

export const getMember = (chatId: number) => (memberId: number) =>
  prisma.member.findFirst({
    where: {
      telegramUser: {
        id: memberId,
      },
      chatInfo: {
        id: chatId,
      },
    },
  })

