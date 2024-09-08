import { Command } from '../../command'
import table from 'text-table'
import { reactionToValue } from './config'
import { prisma } from '../../db'
import { differenceInDays } from 'date-fns'

export const getStatisticCommand: Command = {
  command: 'statistic',
  description: 'Узнать респект пацанов',
  handler: async (ctx) => {
    console.log('statistic')
    const personStatistic = await prisma.reactionMessageEvent.groupBy({
      where: {
        chatId: ctx.chat.id,
        toId: {
          not: {
            equals: prisma.reactionMessageEvent.fields.fromId,
          },
        },
      },
      by: ['toId'],
      _sum: {
        different: true,
      },
      orderBy: {
        _sum: {
          different: 'desc',
        },
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

    const tableStat = personStatistic.map((personStat) => {
      const telegramUser = telegramUsers.find(
        (telegramUser) => telegramUser.id === personStat.toId,
      )
      return [
        telegramUser?.username || telegramUser?.first_name || 'unknown',
        personStat._sum.different || 0,
        telegramUser?.is_premium ? 'Буржуй' : 'Пролетариат',
      ]
    })

    console.log('statistic:\n', tableStat)
    ctx.reply(
      `\`\`\`\n${table([
        ['Имя', 'Респект коины', 'Телеграм статус'],
        ...tableStat,
      ])}\n\`\`\``,
      {
        parse_mode: 'MarkdownV2',
      },
    )
  },
}

export const getReactionValueCommand: Command = {
  command: 'reaction',
  description: 'Узнать количество респекта за реакцию',
  handler: (ctx) => {
    ctx.reply(
      `\`\`\`\n${table(
        reactionToValue.map(([reactions, value]) => [
          value,
          '=',
          reactions.join(', '),
        ]),
      )}\n\`\`\``,
      {
        parse_mode: 'MarkdownV2',
      },
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

export const clownCommand: Command = {
  command: 'clown',
  description: 'Узнать статистику по клоунам',
  handler: async (ctx) => {
    const personStatistic = await prisma.reactionMessageEvent.groupBy({
      where: {
        chatId: ctx.chat.id,
        toId: {
          not: {
            equals: prisma.reactionMessageEvent.fields.fromId,
          },
        },
        newReaction: {
          has: '🤡',
        },
      },
      by: ['toId'],
      _min: {
        date: true,
      },
      orderBy: {
        _sum: {
          id: 'desc',
        },
      },
    })

    const telegramUsers = await prisma.telegramUser.findMany({
      where: {
        id: {
          in: personStatistic.map((personStat) => personStat.toId),
        },
      },
    })

    const tableStat = personStatistic.map((personStat) => {
      const telegramUser = telegramUsers.find(
        (telegramUser) => telegramUser.id === personStat.toId,
      )
      return [
        telegramUser?.username || telegramUser?.first_name || 'unknown',
        personStat._min.date ? differenceInDays(personStat._min.date, Date.now()) : 'nowhen'
      ]
    })

    console.log('statistic:\n', tableStat)
    ctx.reply(
      `\`\`\`\n${table([
        ['Имя', 'Дней без клоуна'],
        ...tableStat,
      ])}\n\`\`\``,
      {
        parse_mode: 'MarkdownV2',
      },
    )
  },
}
