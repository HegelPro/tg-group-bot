import { addDays, addHours, isAfter } from 'date-fns'
import { getChatInfos, getGlobalData } from './gets'
import { writeHourlyTimestamp, writeDailyTimestamp } from './writes'
import { ChatInfo } from '@prisma/client'

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

export const dailyFunction = async (callback: () => void) => {
  const dailyTimestamp = (await getGlobalData()).dailyTimestamp
  const date = new Date()

  console.log('loop часов', date.getHours(), 'минут', date.getMinutes())

  if (isAfter(Date.now(), dailyTimestamp)) {
    callback()
    writeDailyTimestamp(addDays(dailyTimestamp, 1))
  }
}

export const hourlyFunction = async (callback: () => void) => {
  const hourlyTimestamp = (await getGlobalData()).hourlyTimestamp
  if (isAfter(Date.now(), hourlyTimestamp)) {
    callback()
    writeHourlyTimestamp(addHours(hourlyTimestamp, 1))
  }
}

export function registerSenders(senders: Sender[]) {
  async function loop() {
    const chatInfos = await getChatInfos()
    const dailySenders = senders.filter((sender) => sender.type === 'daily')
    dailyFunction(() => {
      dailySenders.forEach((dailySender) => {
        if (dailySender.predicate()) {
          chatInfos.forEach((chatInfo) => dailySender.handler(chatInfo))
        }
      })
    })

    const hourlySenders = senders.filter((sender) => sender.type === 'hourly')
    hourlyFunction(() => {
      hourlySenders.forEach((hourlySender) => {
        if (hourlySender.predicate()) {
          chatInfos.forEach((chatInfo) => hourlySender.handler(chatInfo))
        }
      })
    })

    setTimeout(loop, DELAY_5_MINUTS)
  }
  loop()
}
