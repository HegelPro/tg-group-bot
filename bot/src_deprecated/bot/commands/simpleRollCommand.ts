import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/out/types.node"
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/State";
import { AppState, appStateFromRandom, taskEitherFromState } from "../appState";
import { Command } from "../command";
import { randomArrayElement } from "../random";

const getRoll: (admins: (ChatMemberOwner | ChatMemberAdministrator)[]) => AppState<string> =
  (admins) => pipe(
    appStateFromRandom(randomArrayElement(admins)),
    S.map((randomAdmin) => `${randomAdmin.user.first_name}`)
  )

export const simpleRollCommand: Command<"supergroup"> = {
  type: "supergroup",
  description: 'Рандомный чел из беседы',
  command: 'roll',
  task: ctx => effects => pipe(
    effects.getChatAdministrators,
    TE.map(adminsOrBots => adminsOrBots.filter(adminOrBot => !adminOrBot.user.is_bot)),
    TE.chain(admins => pipe(
      getRoll(admins),
      taskEitherFromState
    )),
    TE.chain(effects.reply)
  )
}
