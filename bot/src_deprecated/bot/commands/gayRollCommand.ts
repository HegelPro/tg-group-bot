import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/out/types.node"
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/State";
import { AppState, appStateFromRandom, taskEitherFromState } from "../appState";
import { Command } from "../command";
import { randomArrayElement } from "../random";

const getRoll: (admins: (ChatMemberOwner | ChatMemberAdministrator)[]) => (abjactives: string[]) => AppState<string> =
  (admins) => (abjactives) => pipe(
    appStateFromRandom(randomArrayElement(admins)),
    S.chain((randomAdmin) => pipe(
      appStateFromRandom(randomArrayElement(abjactives)),
      S.map(randomAbjactive => `${randomAdmin.user.first_name} - ${randomAbjactive} гей!`)
    ))
  )

const abjactives = ["дешевый", 'скучный', "грусный", "жизнерадостный", "уставший", "старый", "вонючий", "продвинутый", "веселый", "грубый", "кровожадный", "кринжовый", "базированный"]


export const gayRollCommand: Command<"supergroup"> = {
  type: "supergroup",
  description: 'Кто гей?',
  command: 'gay_roll',
  task: ctx => effects => pipe(
    effects.getChatAdministrators,
    TE.map(adminsOrBots => adminsOrBots.filter(adminOrBot => !adminOrBot.user.is_bot)),
    TE.chain(admins => pipe(
      getRoll(admins)(abjactives),
      taskEitherFromState
    )),
    TE.chain(effects.reply)
  )
}
