import { insertDefaultIfNotFound } from '../../utils'
import { Command } from '../../command'
import {
  ChatInfo,
  createDefaultChatInfo,
  createDefaultMember,
  Member,
  User,
} from '../../store'
import table from 'text-table'
import { reactionToValue } from './config'
import { getChatInfo, getChatInfos, getMembers } from '../../gets'
import { writeChatInfos } from '../../writes'
import { member } from 'fp-ts/lib/ReadonlyMap'

export const registerCommand: Command = {
  command: 'register',
  description: 'Зарегестрироваться для бота',
  handler: async (ctx) => {
    const user = (await ctx.getAuthor()).user

    const chatInfos = insertDefaultIfNotFound(getChatInfos())(
      (chat) => chat.id === ctx.chat.id,
    )(createDefaultChatInfo(ctx.chat.id))

    const updatedChatInfos: ChatInfo[] = chatInfos.map((chatInfo) =>
      chatInfo.id === ctx.chat.id
        ? {
            ...chatInfo,
            members: insertDefaultIfNotFound(chatInfo.members)(
              (member) => member.user.id === ctx.message?.from.id,
            )(createDefaultMember(user as User)),
          }
        : chatInfo,
    )
    writeChatInfos(updatedChatInfos)
    ctx.reply('Вы успешно зарегестрированы и теперь можете получать респект')
  },
}

export const getStatisticCommand: Command = {
  command: 'statistic',
  description: 'Узнать респект пацанов',
  handler: (ctx) => {
    const chatInfo = getChatInfo(ctx.chat.id)
    if (chatInfo) {
      ctx.reply(
        table(
          chatInfo.members.map((member) => [
            member.user.first_name,
            member.data.reactionScore,
          ]),
        ),
      )
    }
  },
}

export const getReactionValueCommand: Command = {
  command: 'reaction',
  description: 'Узнать количество респекта за реакцию',
  handler: (ctx) => {
    ctx.reply(
      table(
        reactionToValue.map(([reactions, value]) => [
          value,
          '=',
          reactions.join(', '),
        ]),
      ),
    )
  },
}

// export const getDailyGiftCommand: Command = {
//   command: 'daily',
//   description: 'Ежедневная награда',
//   handler: (ctx) => {
//     ctx.reply(
//       table(
//         reactionToValue.map(([reactions, value]) => [
//           value,
//           '=>',
//           reactions.join(', '),
//         ]),
//       ),
//     )
//   },
// }

export const whoIsTheBestCommand: Command = {
  command: 'best',
  description: 'Выбрать Лучшего',
  handler: (ctx) => {
    const members = getMembers(ctx.chat.id)

    if (!members) return
    if (members.length <= 0) return

    const bestMember = members.reduce<Member>(
      (acc, member) =>
        member.data.reactionScore > acc.data.reactionScore ? member : acc,
      members[0],
    )

    ctx.reply(`На данный момент лучшим признан ${bestMember.user.first_name}`)
  },
}

export const clownCommand: Command = {
  command: 'clown',
  description: 'Узнать статистику по клоунам',
  handler: (ctx) => {
    const chatInfo = getChatInfo(ctx.chat.id)
    ctx.reply(
      chatInfo?.members.map((member) => `${member.user.first_name} прожил ${member.data.clownCounter} дней без клоунов`).join('\n') ||
        '???',
    )
  },
}
