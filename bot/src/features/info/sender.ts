import { bot } from '../../bot'
import { wrapDailyMessage } from '../../messageWrappers'
import { DailySender } from '../../sender'
import { isFriday, isMonday, isThursday, isTuesday } from 'date-fns'

const randomNumber = (num: number) => Math.floor(Math.random() * num)

export const dailyInfoSenders: DailySender[] = [
  {
    type: 'daily',
    predicate: () => isMonday(Date.now()),
    handler: (chatInfo) => {
      const user = chatInfo.members[randomNumber(chatInfo.members.length)].user
      bot.api.sendMessage(
        chatInfo.id,
        wrapDailyMessage(
          `Сегодня день порно! Сегодня ролик выбирает: @${
            user.username || user.first_name
          }`,
        ),
      )
    },
  },
  {
    type: 'daily',
    predicate: () => isTuesday(Date.now()),
    handler: (chatInfo) => {
      bot.api.sendMessage(
        chatInfo.id,
        wrapDailyMessage('Давай зарядимся вместе в этот чудесный день!'),
      )
      bot.api.sendVideo(
        chatInfo.id,
        'https://github.com/HegelPro/HegelPro.github.io/raw/master/1006705794_An_W_SFIJdqP0Ih6vjhuqV4AzabBypuCS0vR1OT5uSzmfhYJSmGP.mp4',
      )
    },
  },
  {
    type: 'daily',
    predicate: () => isThursday(Date.now()),
    handler: (chatInfo) => {
      bot.api.sendMessage(chatInfo.id, wrapDailyMessage('Встаем на зарядку!'))
      bot.api.sendVideo(
        chatInfo.id,
        'https://github.com/HegelPro/HegelPro.github.io/raw/master/1006705794_An_evFMekFtoydFf22yL5Rx8LliJ4QQpmm2iOU2sNWXfYazQWt9rgLenxqtIF.mp4',
      )
    },
  },
  {
    type: 'daily',
    predicate: () => isFriday(Date.now()),
    handler: (chatInfo) => {
      bot.api.sendMessage(
        chatInfo.id,
        wrapDailyMessage('Давай зарядимся вместе в этот чудесный день!'),
      )
      bot.api.sendVideo(
        chatInfo.id,
        'https://github.com/HegelPro/HegelPro.github.io/raw/master/1006705794_An_InhYpGi2qX8r24C7171Ax4x_STq1tTsfad18hLHtvMb_5Big6UD.mp4',
      )
    },
  },
  // {
  //   isDayOfTheWeekFunctions: [isWednesday],
  //   sender: () => {},
  // },
  // {
  //   isDayOfTheWeekFunctions: [isSaturday],
  //   sender: () => {},
  // },
  // {
  //   isDayOfTheWeekFunctions: [isSunday],
  //   sender: () => {},
  // },
]
