import { Bot, Context, session, SessionFlavor } from 'grammy'

if (process.env.TG_BOT_API_TOKEN === undefined)
  throw new Error('TG_BOT_API_TOKEN env var not found')

interface SessionData {
  chat: {
    one: 1
  }
  chatUser: {
    two: 2
  }
}
interface MyContext extends Context, SessionFlavor<SessionData> {}

export const bot = new Bot<MyContext>(process.env.TG_BOT_API_TOKEN)

bot.use(
  session({
    type: 'multi',
    chat: {
      getSessionKey: (ctx) => ctx.chat?.id.toString(),
    },
    chatUser: {
      getSessionKey: (ctx) =>
        ctx.from === undefined || ctx.chat === undefined
          ? undefined
          : `${ctx.from.id}_${ctx.chat.id}`,
    },
  }),
)
