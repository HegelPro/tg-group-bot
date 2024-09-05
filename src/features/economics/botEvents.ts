import { Context } from 'grammy'
import { bot } from '../../bot'
import { BotEvent } from '../../botEvents'
import { getMember, getMessage } from '../../gets'
import { countReactionValue } from '../../reaction'
import { User } from 'grammy/types'

// const banUser = (ctx: Context) => (user: User) => {
//   ctx.reply(`${user?.first_name} уходит в ВЕЧНЫЙ самобан за игру с доверием!`)
// }

// export const reactionEconomicBotEvent: BotEvent = () =>
//   bot.on('message_reaction', async (ctx) => {
//     const { new_reaction, old_reaction, message_id, user } = ctx.messageReaction
//     const reactionValue = countReactionValue(new_reaction, old_reaction)

//     const foundMessage = await getMessage(ctx.chat.id)(message_id)

//     if (!foundMessage) return

//     if (foundMessage.from_id === user?.id) return

//     const foundMember = getMember(ctx.chat.id)(foundMessage.from.id)


//     // if (
//     //   old_reaction.find(
//     //     (reaction) => reaction.type === 'emoji' && reaction.emoji === '🤝',
//     //   ) &&
//     //   user
//     // ) {
//     //   banUser(ctx)(user)
//     // }

//     // if (
//     //   new_reaction.some(
//     //     (reaction) => reaction.type === 'emoji' && reaction.emoji === '🤡',
//     //   )
//     // ) {
//     //   writeClownCounter(ctx.chat.id)(foundMessage.from.id)(0)
//     // }

//     // writeReactionScore(ctx.chat.id)(foundMessage.from.id)(
//     //   foundMember.data.reactionScore + reactionValue,
//     // )

//     ctx.reply(
//       `${
//         foundMessage.from.first_name
//       } получил ${reactionValue} респекта за ${new_reaction
//         .map((reaction) => (reaction.type === 'emoji' ? reaction.emoji : '???'))
//         .join(', ')} от ${user?.first_name}`,
//     )
//   })
