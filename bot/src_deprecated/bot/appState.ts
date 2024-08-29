import * as S from "fp-ts/State";
import * as IO from "fp-ts/IO";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Message } from "grammy/out/types.node";

type AppStateData = {
  seed: number,
  chats: Array<{
    chatId: number,
    stasticMessageId: number,
    usersInfo: Array<{
      userId: number,
      userMessageCounter: number
    }>,
    messages: Array<Message.TextMessage>
  }>
}

export type AppState<A> = S.State<AppStateData, A>

if (process.env.DB_PATH === undefined) throw new Error('DB_PATH env var not found');

const dbPath = join(__dirname, '../..', process.env.DB_PATH)
let __state__: AppStateData = JSON.parse(readFileSync(dbPath, 'utf-8'))


export const ioFromState = <A>(action: AppState<A>): IO.IO<A> => () => {
  const [output, newState] = action(__state__);
  __state__ = newState;
  writeFileSync(dbPath, JSON.stringify(__state__), 'utf-8')
  return output
};

export const taskFromState = <A>(action: AppState<A>): T.Task<A> => T.fromIO(ioFromState(action))

export const taskEitherFromState = <A>(action: AppState<A>): TE.TaskEither<string, A> => TE.fromIO(ioFromState(action))

// export const randomFromAppState = <A>(stateS: AppState<A>): S.State<number, A> =>
//     (seed) => {
//         const output = ioFromState(stateS)()
//         return [output, seed]
//     }

export const appStateFromRandom = <A>(randomS: S.State<number, A>): AppState<A> =>
  (state) => {
    const [output, newSeed] = randomS(state.seed)
    return [output, { ...state, seed: newSeed }]
  }

export const getAppState = S.get<AppStateData>()
