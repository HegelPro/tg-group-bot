export type BotEvent = () => void

export const registerBotEvents = (botEvents: BotEvent[]) => {
  botEvents.forEach(botEvent => botEvent())
}