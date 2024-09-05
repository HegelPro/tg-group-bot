import { Bot } from 'grammy'

if (process.env.TG_BOT_API_TOKEN === undefined)
  throw new Error('TG_BOT_API_TOKEN env var not found')

export const bot = new Bot(process.env.TG_BOT_API_TOKEN)
