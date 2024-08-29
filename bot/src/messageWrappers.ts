import { getGlobalData } from "./gets"

export function wrapDailyMessage(text: string) {
  const durovCounter = getGlobalData().durovCounter
  return `${text}\n\nПразднуем ${durovCounter} день освобождения Дурова! Радуемся, но помним, что история еще не закончена. #FREEDUROV`
}
