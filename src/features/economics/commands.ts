import { Command } from '../../command'
import table from 'text-table'
import { reactionToValue } from './config'
import { prisma } from '../../db'
import { differenceInDays, format, intlFormat } from 'date-fns'
import { InlineKeyboard } from 'grammy'
import { getUserName } from '../../utils'

export const getStatisticCommand: Command = {
  command: 'statistic',
  description: 'Узнать респект пацанов',
  handler: async (ctx) => {
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
        telegramUser ? getUserName(telegramUser) : 'unknown',
        personStat._sum.different || 0,
        telegramUser?.is_premium ? 'Буржуй' : 'Пролетариат',
      ]
    })

    console.log('statistic:\n', tableStat)
    ctx.reply(
      `\`\`\`\n${table([
        ['Имя', 'Очки_социального_одобрения', 'Телеграм_статус'],
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

export const test2Command: Command = {
  command: 'test2',
  hide: true,
  description: 'Тест',
  handler: async (ctx) => {
    // ctx.callbackQuery('')
    // const makeup = new InlineKeyboard().text('textBtn', `test-query:user=${ctx.message?.from.id}`)
    const makeup = new InlineKeyboard()
      .text('text1Btn', 'test-query')
      .text('text2Btn', 'click-payload')
    ctx.reply('Test', { reply_markup: makeup })
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
      _max: {
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
        telegramUser ? getUserName(telegramUser) : 'unknown',
        personStat._max.date
          ? differenceInDays(Date.now(), personStat._max.date)
          : 'nowhen',
        intlFormat(personStat._max.date || Date.now(), {
          locale: 'ru',
        }),
      ]
    })

    console.log('statistic:\n', tableStat)
    ctx.reply(
      `\`\`\`\n${table([
        ['Имя', 'Дней без клоуна', 'Дата последнего клоуна'],
        ...tableStat,
      ])}\n\`\`\``,
      {
        parse_mode: 'MarkdownV2',
      },
    )
  },
}
