import { addDays, addHours, isAfter } from 'date-fns'
import { getChatInfos, getGlobalData } from './gets'
import { ChatInfo } from './store'
import {
  writeDurovCounter,
  writeHourlyTimestamp,
  writeDailyTimestamp,
  writeChatInfos,
} from './writes'

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

export const dailyFunction = (callback: () => void) => {
  const dailyTimestamp = getGlobalData().dailyTimestamp
  const date = new Date()
  console.log('loop часов', date.getHours(), 'минут', date.getMinutes())
  if (isAfter(Date.now(), dailyTimestamp)) {
    callback()
    writeDailyTimestamp(addDays(dailyTimestamp, 1).getTime())
  }
}

export const hourlyFunction = (callback: () => void) => {
  const hourlyTimestamp = getGlobalData().hourlyTimestamp
  if (isAfter(Date.now(), hourlyTimestamp)) {
    callback()
    writeHourlyTimestamp(addHours(hourlyTimestamp, 1).getTime())
  }
}

export function registerSenders(senders: Sender[]) {
  function loop() {
    const dailySenders = senders.filter((sender) => sender.type === 'daily')
    dailyFunction(() => {
      const durovCounter = getGlobalData().durovCounter
      writeDurovCounter(durovCounter + 1)
      const chatInfos = getChatInfos().map((chatInfo) => ({
        ...chatInfo,
        members: chatInfo.members.map((member) => ({
          ...member,
          data: { ...member.data, clownCounter: member.data.clownCounter + 1 },
        })),
      }))
      writeChatInfos(chatInfos)

      dailySenders.forEach((dailySender) => {
        if (dailySender.predicate()) {
          getChatInfos().forEach((chatInfo) => dailySender.handler(chatInfo))
        }
      })
    })

    const hourlySenders = senders.filter((sender) => sender.type === 'hourly')
    hourlyFunction(() => {
      hourlySenders.forEach((hourlySender) => {
        if (hourlySender.predicate()) {
          getChatInfos().forEach((chatInfo) => hourlySender.handler(chatInfo))
        }
      })
    })

    setTimeout(loop, DELAY_5_MINUTS)
  }
  loop()
}
