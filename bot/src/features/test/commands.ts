import { Command } from '../../command'

export const sendVideoCommand: Command = {
  command: 'video',
  description: 'Any',
  handler: (ctx) => {
    try {
      ctx.api.sendVideo(
        ctx.chat.id,
        'https://github.com/HegelPro/HegelPro.github.io/raw/master/1006705794_An_evFMekFtoydFf22yL5Rx8LliJ4QQpmm2iOU2sNWXfYazQWt9rgLenxqtIF.mp4',
      )
    } catch (e) {
      console.error(e)
    }
  },
  hide: true,
}
