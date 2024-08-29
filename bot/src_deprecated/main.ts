import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE })

import { bot } from "./bot/bot"
import { Command, CommandTask, addCommand, getEffects } from './bot/command';
import { gayRollCommand } from './bot/commands/gayRollCommand';
import { communismIsBadCommand } from './bot/commands/communismIsBadCommand';
import * as T from "fp-ts/Task";
import { statisticCommand } from './bot/commands/statisticCommand';
import { pipe } from 'fp-ts/lib/function';
import { AppState, getAppState, ioFromState, taskEitherFromState } from './bot/appState';
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import { callChatGPT } from './bot/chatGpt';
import * as E from "fp-ts/Either";
import * as S from "fp-ts/State";
import * as O from "fp-ts/Option";
import { simpleRollCommand } from './bot/commands/simpleRollCommand';
import { Message } from 'grammy/types';
import { isString } from 'fp-ts/lib/string';

export const commands: Command[] = [
  gayRollCommand,
  simpleRollCommand,
  // communismIsBadCommand,
  // statisticCommand
]

bot.api.setMyCommands(commands);

commands.forEach(addCommand(bot));

// const updateStatistic: TE.TaskEither<string, any> = pipe(
//   getAppState,
//   taskEitherFromState,
//   TE.map(state => {
//     console.log(state.chats[0])
//     return state
//   }),
//   TE.chain(state =>
//     pipe(
//       state.chats,
//       A.map(chat =>
//         TE.tryCatch(
//           () => bot.api.editMessageText(chat.chatId, chat.stasticMessageId, new Date().toLocaleString()), String)
//       ),
//       A.sequence(TE.taskEither)
//     )
//   ),
//   // TE.map(e => {
//   //   counter++;
//   //   return e
//   // }),
//   T.delay(5000),
//   TE.chain(() => () => {
//     // const kek = ioFromState(getAppState)();
//     // console.log(kek.chats[0])
//     return updateStatistic()
//   }),
//   TE.orElse(() => updateStatistic)
// )
// updateStatistic()

// const getText = (text: string) =>
//   `Найди в тексте все матные и выведи их в формате JSON списка, без лишних текста в ответе.
// Текст: "${text}"
// Формат ответа: "["ответ1","ответ2","ответ3"]"`

// const modifyPushMessage: (message: Message.TextMessage) => AppState<void> =
//   message =>
//     S.modify(state => ({
//       ...state, chats: state.chats.map(
//         chat =>
//           chat.chatId === message.chat.id
//             ? { ...chat, messages: [...chat.messages, message] }
//             : chat
//       )
//     })
//   )

// const countBadWordsTask: CommandTask<'supergroup'> = ctx => effects => pipe(
//   O.fromNullable(ctx.message),
//   TE.fromOption(String),
//   TE.chain((message) => pipe(
//     modifyPushMessage({text:'', ...message}),
//     S.map(() => message.text || ''),
//     taskEitherFromState
//   )),
//   TE.chain(text => callChatGPT(getText(text))),
//   TE.chain(answer => pipe(
//     O.fromNullable(answer),
//     TE.fromOption(String),
//     TE.chain(answer => TE.tryCatch(async () => JSON.parse(answer) as unknown, String)),
//     TE.map(answers => Array.isArray(answers) && answers.every(isString) ? answers : [])
//   )),
//   TE.chain(answers => effects.reply(`Использовал ${answers.length} матных слова: ${answers.join()}`)),
// )

bot.chatType('supergroup').on('message', ctx => {
  // countBadWordsTask(ctx)(getEffects(ctx))()
})

// START APP

const startBotTask: T.Task<void> = () => bot.start({ onStart: () => console.log('bot is started') })

startBotTask()