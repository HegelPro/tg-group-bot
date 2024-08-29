import { Command } from '../../command'
import { writeChatInfos } from '../../writes'
import { getChatInfos } from '../../gets'

export const subscribeCommand: Command = {
  command: 'subscribe',
  description: 'Получать рассылку от бота',
  handler: (ctx) => {
    const chatInfos = getChatInfos().map((chatInfo) =>
      chatInfo.id === ctx.chat.id
        ? { ...chatInfo, data: { ...chatInfo.data, subscribed: true } }
        : chatInfo,
    )
    writeChatInfos(chatInfos)
  },
}
