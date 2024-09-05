import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { callChatGPT } from "../chatGpt";
import { Command } from "../command";


export const communismIsBadCommand: Command<"supergroup"> = {
  type: "supergroup",
  command: "communism_is_bad",
  description: 'Почему коммунизм не работает?',
  task: () => (effects) =>
    pipe(
      callChatGPT("Приведи аргумент почему коммунизм не работает. Оставь только аргумент без вступления и вывода"),
      TE.map(answer => answer || ''),
      TE.chain(effects.reply)
    )
}
