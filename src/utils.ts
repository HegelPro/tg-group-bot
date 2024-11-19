import { TelegramUser } from "@prisma/client"
import { User } from "grammy/types"

export function declOfNum(number: number, titles: string[]) {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ]
}

export const getUserName = (telegramUser: User | TelegramUser) => telegramUser.username || telegramUser.first_name
