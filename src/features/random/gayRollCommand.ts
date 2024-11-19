import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/out/types.node"
import { Command } from "../../command";
import { prisma } from "../../db";


const abjactives = ["дешевый", 'скучный', "грусный", "жизнерадостный", "уставший", "старый", "вонючий", "продвинутый", "веселый", "грубый", "кровожадный", "кринжовый", "базированный"]

const select = (randomAdmin: ChatMemberOwner | ChatMemberAdministrator) => (randomAbjactive: string) => `${randomAdmin.user.first_name} - ${randomAbjactive} гей!`

export const gayRollCommand: Command = {
  command: 'gay_roll',
  description: 'Кто гей?',
  handler: async (ctx) => {
    const chat = await prisma.telegramChat.findFirst({
      where: {
        id: ctx.chat.id
      }
    })
    // const k = await prisma.telegramUser.findMany({
    //   where: {
    //     ''
    //   }
    // })
    // ctx.reply(`${chat.}`)
  }
}
