import { Command } from '../../command'
import axios from 'axios'

export const wikiCommand: Command = {
  command: 'wiki',
  description: 'Получить случайную статью википедии',
  handler: async (ctx) => {
    const url = await axios
      .get('https://ru.wikipedia.org/api/rest_v1/page/random/summary')
      .then((response) => response.data.content_urls.desktop.page)
      .catch(function (error) {
        // handle error
        console.log(error)
      })

    ctx.reply(`Читай + Умней! - [Случайная статья из WIKI](${url})\n`, {
      parse_mode: 'Markdown',
    })
  },
}
