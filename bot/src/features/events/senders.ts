import { isSameDay } from 'date-fns'
import { DailySender, HourlySender } from '../../sender'
import axios from 'axios'
import { bot } from '../../bot'
import { wrapDailyMessage } from '../../messageWrappers'

export const isFirstSeptember = (date: Date) => {
  return isSameDay(date, new Date('9.1.2024'))
}

export const firstSeptemberDailylySender: DailySender = {
  type: 'daily',
  predicate: () => isFirstSeptember(new Date()),
  handler: (chatInfo) => {
    bot.api.sendMessage(
      chatInfo.id,
      wrapDailyMessage('Давай зарядимся вместе в этот чудесный день!'),
    )
  },
}

export const firstSeptemberHourlySender: HourlySender = {
  type: 'hourly',
  predicate: () => isFirstSeptember(new Date()),
  handler: (chatInfo) => {
    axios
      .get('https://ru.wikipedia.org/api/rest_v1/page/random/summary')
      .then(function (response) {
        const url = response.data.content_urls.desktop.page
        bot.api.sendMessage(
          chatInfo.id,
          `Читай+Умней! - [Случайная статья из WIKI](${url})`,
        )
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  },
}
