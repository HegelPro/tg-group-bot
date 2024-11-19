import * as dotenv from 'dotenv'
dotenv.config({ path: process.env.ENV_FILE })

import { bot } from './bot'
import {
  clownCommand,
  getReactionValueCommand,
  getStatisticCommand,
  test2Command,
} from './features/economics/commands'
import { Command, registerCommands } from './command'
import { wikiCommand } from './features/info/commands'
import { registerSenders } from './sender'
import { sendVideoCommand } from './features/test/commands'
import { BotEvent, registerBotEvents } from './botEvents'
import {
  collectMessageBotEvent,
  collectReactionBotEvent,
} from './features/dataCollector/botEvent'

const commands: Command[] = [
  test2Command,
  wikiCommand,
  getStatisticCommand,
  getReactionValueCommand,
  sendVideoCommand,
  clownCommand,
]

registerCommands(commands)

registerSenders()

const botEvents: BotEvent[] = [collectMessageBotEvent, collectReactionBotEvent]

registerBotEvents(botEvents)

// const kek = bot.callbackQuery('test-query', async (ctx) => {
//   console.log('test-query:', (await ctx.getAuthor()).user)
//   ctx.reply('test passed')
//   kek.drop((ctx) => true)
// })

// bot.callbackQuery('click-payload', async (ctx) => {
//   console.log('click-payload:', (await ctx.getAuthor()).user)
//   await ctx.answerCallbackQuery({
//     text: 'You were curious, indeed!',
//   })
// })

// bot.on('callback_query', async (ctx) => {
//   const callbackData = ctx.callbackQuery.data
//   await ctx.answerCallbackQuery(`Вы нажали на кнопку: ${callbackData}`)
//   await ctx.reply(`Вы ответ: ${callbackData}`)
// })

// bot.on('callback_query:data', async (ctx) => {
//   const callbackData = ctx.callbackQuery.data
//   await ctx.answerCallbackQuery(`Вы нажали на кнопку: ${callbackData}`)
//   await ctx.reply(`data: Вы ответ: ${callbackData}`)
// })

bot.on('chat_member', (ctx) => {
  console.log('chat_member:', ctx.chatMember)
})

bot.start({
  allowed_updates: [
    'message_reaction',
    'message',
    'callback_query',
  ],
  onStart: () => console.log('bot is started'),
})
