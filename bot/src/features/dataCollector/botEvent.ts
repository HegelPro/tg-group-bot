import { bot } from '../../bot'
import { BotEvent } from '../../botEvents'
import { getChatInfos } from '../../gets'
import {
  createDefaultChatInfo,
  Message,
} from '../../store'
import { insertDefaultIfNotFound } from '../../utils'
import { writeChatInfos } from '../../writes'

const addMessageToChatInfo = (chatId: number) => (message: Message) => {
  const chatInfos = insertDefaultIfNotFound(getChatInfos())(
    (chat) => chat.id === chatId,
  )(createDefaultChatInfo(chatId)).map((chatInfo) =>
    chatInfo.id === chatId
      ? {
          ...chatInfo,
          messages: [...chatInfo.messages, message],
        }
      : chatInfo,
  )
  writeChatInfos(chatInfos)
}

export const collectMessageBotEvent: BotEvent = () =>
  bot.on('message', async (ctx) => {
    addMessageToChatInfo(ctx.chat.id)(ctx.message as Message)
  })
