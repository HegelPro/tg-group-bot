import { getState } from './store'

export const getChatInfos = () => getState().chatInfos

export const getChatInfo = (chatId: number) =>
  getChatInfos().find((chatInfo) => chatInfo.id === chatId)

export const getMessages = (chatId: number) => getChatInfo(chatId)?.messages

export const getMessage = (chatId: number) => (messageId: number) =>
  getMessages(chatId)?.find((message) => message.message_id === messageId)

export const getMembers = (chatId: number) => getChatInfo(chatId)?.members

export const getMember = (chatId: number) => (memberId: number) =>
  getMembers(chatId)?.find((member) => member.user.id === memberId)

export const getGlobalData = () => getState().data 
