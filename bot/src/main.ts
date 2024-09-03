import * as dotenv from 'dotenv'
dotenv.config({ path: process.env.ENV_FILE })

import { bot } from './bot'
import {
  clownCommand,
  getReactionValueCommand,
  getStatisticCommand,
  registerCommand,
  whoIsTheBestCommand,
} from './features/economics/commands'
import { Command, registerCommands } from './command'
import { subscribeCommand, wikiCommand } from './features/info/commands'
import { dailyInfoSenders } from './features/info/sender'
import { registerSenders, Sender } from './sender'
import { sendVideoCommand } from './features/test/commands'
import { BotEvent, registerBotEvents } from './botEvents'
import { reactionEconomicBotEvent } from './features/economics/botEvents'
import { collectMessageBotEvent } from './features/dataCollector/botEvent'

const commands: Command[] = [
  wikiCommand,
  registerCommand,
  getStatisticCommand,
  getReactionValueCommand,
  whoIsTheBestCommand,
  subscribeCommand,
  sendVideoCommand,
  clownCommand,
]

registerCommands(commands)

const senders: Sender[] = [
  ...dailyInfoSenders,
]

registerSenders(senders)

const botEvents: BotEvent[] = [collectMessageBotEvent, reactionEconomicBotEvent]

registerBotEvents(botEvents)

bot.start({
  allowed_updates: ['message_reaction', 'message'],
  onStart: () => console.log('bot is started'),
})
