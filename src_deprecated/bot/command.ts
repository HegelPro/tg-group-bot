import { Bot, ChatTypeContext, Context } from "grammy"
import { Chat, ChatMemberAdministrator, ChatMemberOwner, Message } from "grammy/out/types.node"
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";
import { bot } from "./bot";

type Effects<T extends Chat["type"] = any> = {
  getChatAdministrators: TE.TaskEither<
    string,
    (ChatMemberAdministrator | ChatMemberOwner)[]
  >,
  reply: (text: string) => TE.TaskEither<
    string,
    Message.TextMessage
  >,
  editMessageText: (message_id: number, text: string) => TE.TaskEither<
    string,
    unknown
  >
}
export const getEffects = <T extends Chat["type"] = any>(ctx: ChatTypeContext<Context, T>): Effects<T> => {
  return {
    getChatAdministrators: TE.tryCatch(() => ctx.getChatAdministrators(), String),
    reply: TE.tryCatchK(text => ctx.reply(text), String),
    editMessageText: TE.tryCatchK((message_id, text) => bot.api.editMessageText(ctx.chat.id, message_id, text), String)
  }
}

export type CommandTask<T extends Chat["type"] = any> = (ctx: ChatTypeContext<Context, T>) => (effects: Effects) => TE.TaskEither<string, unknown>

export interface Command<T extends Chat["type"] = any> {
  command: string,
  description: string,
  type: T | T[],
  task: CommandTask
}

export const addCommand = (bot: Bot) => (command: Command) => {
  bot.chatType(command.type).command(command.command, (ctx: any) => {
    console.log(ctx.chat.id)
    const effects = getEffects(ctx);
    return pipe(
      command.task(ctx)(effects),
      TE.map(e => e)
    )()
  })
}