import { Command } from '../../command'
import { writeChatInfos } from '../../writes'
import { getChatInfos } from '../../gets'
import axios from 'axios'

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

export const wikiCommand: Command = {
  command: 'wiki',
  description: 'Получить случайную статью википедии',
  handler: (ctx) => {
    axios
      .get('https://ru.wikipedia.org/api/rest_v1/page/random/summary')
      .then(function (response) {
        const url = response.data.content_urls.desktop.page
        ctx.reply(
          `Читай+Умней! - [Случайная статья из WIKI](${url})`,
          { parse_mode: 'MarkdownV2' },
        )
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  },
}

