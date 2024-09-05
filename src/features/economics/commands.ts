import { Command } from '../../command'
import table from 'text-table'
import { reactionToValue } from './config'
import { prisma } from '../../db'

export const getStatisticCommand: Command = {
  command: 'statistic',
  description: 'Узнать респект пацанов',
  handler: async (ctx) => {
    console.log('statistic')
    const personStatistic = await prisma.reactionMessageEvent.groupBy({
      where: {
        chatId: ctx.chat.id,
      },
      by: ['toId'],
      _sum: {
        different: true,
      },
    })
    console.log('personStatistic:', personStatistic)

    const telegramUsers = await prisma.telegramUser.findMany({
      where: {
        id: {
          in: personStatistic.map((personStat) => personStat.toId),
        },
      },
    })
    // console.log('members:', members)

    const tableStat =
      telegramUsers.map((telegramUser) => [
        telegramUser.username || telegramUser.first_name,
        personStatistic.find(
          (personStat) => personStat.toId === telegramUser.id,
        )?._sum.different || 0,
      ])

    console.log('statistic:\n', tableStat)
    ctx.reply(table([['Имя', 'Респект коины'], ...tableStat]))
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
    // const members = getMembers(ctx.chat.id)
    // if (!members) return
    // if (members.length <= 0) return
    // const bestMember = members.reduce<Member>(
    //   (acc, member) =>
    //     member.data.reactionScore > acc.data.reactionScore ? member : acc,
    //   members[0],
    // )
    // ctx.reply(`На данный момент лучшим признан ${bestMember.user.first_name}`)
  },
}

export const clownCommand: Command = {
  command: 'clown',
  description: 'Узнать статистику по клоунам',
  handler: async (ctx) => {
    // const chatInfo = await getChatInfo(ctx.chat.id)
    // ctx.reply(
    //   chatInfo?.members.map((member) => `${member.user.first_name} прожил ${member.data.clownCounter} дней без клоунов`).join('\n') ||
    //     '???',
    // )
  },
}
