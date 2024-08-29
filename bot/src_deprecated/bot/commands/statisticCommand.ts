import { identity, pipe } from "fp-ts/lib/function";
import { Command, CommandTask } from "../command";
import { AppState, getAppState, taskEitherFromState } from "../appState";
import * as S from 'fp-ts/State';
import * as A from "fp-ts/Array";
import * as O from 'fp-ts/Option'
import * as TE from "fp-ts/TaskEither";
import { callChatGPT } from "../chatGpt";
import { isString } from "fp-ts/lib/string";
import { Message } from "grammy/out/types.node";

const getStatistic: (chatId: number) => AppState<string> =
  (chatId) => pipe(
    getAppState,
    S.map(state => pipe(
      state.chats,
      A.findFirst(chat => chat.chatId === chatId),
      O.map(chat => pipe(
        chat.usersInfo,
        A.reduce("d", (acc, userInfo) => acc + `${userInfo.userId} - ${userInfo.userMessageCounter} messages`),
      )),
      O.match(() => "blat", identity)
    ))
  )

const modifyStasticMessageId: (chatId: number) => (stasticMessageId: number) => AppState<void> =
  (chatId) => (stasticMessageId) =>
    S.modify(state => ({
      ...state, chats: state.chats.map(
        chat =>
          chat.chatId === chatId
            ? { ...chat, stasticMessageId }
            : chat
      )
    }))

console.log('Updated')

export const statisticCommand: Command<"supergroup"> = {
  type: "supergroup",
  description: 'Статистика сообщений?',
  command: 'statistic',
  task: ctx => effects => pipe(
    getStatistic(ctx.chat.id),
    taskEitherFromState,
    TE.chain(effects.reply),
    TE.chain(message => pipe(
      modifyStasticMessageId(message.chat.id)(message.message_id),
      taskEitherFromState
    )),
  )
}
