import { CommandMiddleware, Context } from 'grammy'
import { BotCommand, Chat } from 'grammy/out/types.node'
import { bot } from './bot'

export interface Command<T extends Chat['type'] = any> extends BotCommand {
  type?: T | T[]
  handler: CommandMiddleware<Context>
  hide?: boolean
}

const registerCommand = (command: Command) => {
  if (command.type) {
    bot.chatType(command.type).command(command.command, command.handler)
  } else {
    bot.command(command.command, command.handler)
  }
}

export function registerCommands(commands: Command[]) {
  bot.api.setMyCommands(commands.filter((command) => !command.hide))
  commands.forEach(registerCommand)
}
