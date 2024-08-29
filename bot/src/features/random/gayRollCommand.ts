import { ChatMemberAdministrator, ChatMemberOwner } from "grammy/out/types.node"
import { Command } from "../../command";


const abjactives = ["дешевый", 'скучный', "грусный", "жизнерадостный", "уставший", "старый", "вонючий", "продвинутый", "веселый", "грубый", "кровожадный", "кринжовый", "базированный"]

const select = (randomAdmin: ChatMemberOwner | ChatMemberAdministrator) => (randomAbjactive: string) => `${randomAdmin.user.first_name} - ${randomAbjactive} гей!`

// export const gayRollCommand: Command = {
//   type: "supergroup",
//   description: 'Кто гей?',
//   command: 'gay_roll',
//   handler: (ctx) => {
//     ctx.reply("Ты!")
//   }
// }
