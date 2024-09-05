import { isSameDay } from 'date-fns'
import { DailySender, HourlySender } from '../../sender'

const isFirstSeptember = (date: Date) => {
  return isSameDay(date, new Date('9.1.2024'))
}

const firstSeptemberDailylySender: DailySender = {
  type: 'daily',
  predicate: () => isFirstSeptember(new Date()),
  handler: (chatInfo) => {
  },
}

const firstSeptemberHourlySender: HourlySender = {
  type: 'hourly',
  predicate: () => isFirstSeptember(new Date()),
  handler: (chatInfo) => {
    
  },
}
