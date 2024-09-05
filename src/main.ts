import * as dotenv from 'dotenv'
dotenv.config({ path: process.env.ENV_FILE })

import { bot } from './bot'
import {
  clownCommand,
  getReactionValueCommand,
  getStatisticCommand,
  whoIsTheBestCommand,
} from './features/economics/commands'
import { Command, registerCommands } from './command'
import { wikiCommand } from './features/info/commands'
import { dailyInfoSenders } from './features/info/sender'
import { registerSenders, Sender } from './sender'
import { sendVideoCommand } from './features/test/commands'
import { BotEvent, registerBotEvents } from './botEvents'
import {
  collectMessageBotEvent,
  collectReactionBotEvent,
} from './features/dataCollector/botEvent'

const commands: Command[] = [
  wikiCommand,
  getStatisticCommand,
  getReactionValueCommand,
  whoIsTheBestCommand,
  sendVideoCommand,
  clownCommand,
]

registerCommands(commands)

const senders: Sender[] = [...dailyInfoSenders]

registerSenders(senders)

const botEvents: BotEvent[] = [collectMessageBotEvent, collectReactionBotEvent]

registerBotEvents(botEvents)

bot.start({
  allowed_updates: ['message_reaction', 'message'],
  onStart: () => console.log('bot is started'),
})
