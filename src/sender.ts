import { addDays, addHours, addWeeks, isAfter } from 'date-fns'
import { ChatInfo } from '@prisma/client'
import { prisma } from './db'
import { bot } from './bot'

export interface BaseSender {
  predicate: () => boolean
  handler: (chatInfo: ChatInfo) => void
}

export interface DailySender extends BaseSender {
  type: 'daily'
}

export interface HourlySender extends BaseSender {
  type: 'hourly'
}

export type Sender = DailySender | HourlySender

const DELAY_5_MINUTS = 5 * 60 * 1000

export function registerSenders() {
  async function loop() {
    console.log('registerSenders loop:')
    console.log('now:', new Date().toISOString())
    const telegramChats = await prisma.telegramChat.findMany()
    const regularEvents = await prisma.regularEvent.findMany()

    regularEvents.forEach(async (regularEvent) => {
      console.log('regularEvent:', regularEvent)
      console.log('regularEventNextDate:', regularEvent.nextDate.toISOString())

      if (isAfter(new Date(), regularEvent.nextDate)) {
        console.log('now is after event')
        telegramChats.forEach(async (telegramChat) => {
          console.log('telegramChat:', telegramChat)

          if (regularEvent.text) {
            await bot.api.sendMessage(telegramChat.id, regularEvent.text)
          }
          if (regularEvent.video) {
            await bot.api.sendVideo(telegramChat.id, regularEvent.video)
          }
        })
        await prisma.regularEvent.update({
          where: {
            id: regularEvent.id,
          },
          data: {
            date: regularEvent.nextDate,
          },
        })
        if (regularEvent.type === 'weekly') {
          await prisma.regularEvent.update({
            where: {
              id: regularEvent.id,
            },
            data: {
              nextDate: addWeeks(regularEvent.nextDate, 1),
            },
          })
        } else if (regularEvent.type === 'daily') {
          await prisma.regularEvent.update({
            where: {
              id: regularEvent.id,
            },
            data: {
              nextDate: addDays(regularEvent.nextDate, 1),
            },
          })
        } else if (regularEvent.type === 'hourly') {
          await prisma.regularEvent.update({
            where: {
              id: regularEvent.id,
            },
            data: {
              nextDate: addHours(regularEvent.nextDate, 1),
            },
          })
        } else if (regularEvent.type === 'randomly') {
          await prisma.regularEvent.update({
            where: {
              id: regularEvent.id,
            },
            data: {
              nextDate: addWeeks(regularEvent.nextDate, 1),
            },
          })
        }
      }
      if (
        regularEvent.destroyDate &&
        isAfter(new Date(), regularEvent.destroyDate)
      ) {
        await prisma.regularEvent.delete({
          where: {
            id: regularEvent.id,
          },
        })
      }
    })

    setTimeout(loop, DELAY_5_MINUTS)
  }
  loop()
}
