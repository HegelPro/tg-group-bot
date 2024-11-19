import { ReactionTypeEmoji } from 'grammy/types'
import { bot } from '../../bot'
import { BotEvent } from '../../botEvents'
import { prisma } from '../../db'
import { getMessage } from '../../gets'
import { countReactionValue } from '../../reaction'
import { syncTelegramChat, syncTelegramUser } from './sync'
import { declOfNum, getUserName } from '../../utils'

export const collectMessageBotEvent: BotEvent = () =>
  bot.on('message', async (ctx) => {
    await syncTelegramChat(ctx.chat.id, ctx.chat)
    await syncTelegramUser(ctx.message.from.id, ctx.message.from)

    await prisma.messageEvent.create({
      data: {
        from_id: ctx.message.from.id,
        chat_id: ctx.chat.id,
        id: ctx.message.message_id,
        date: new Date(ctx.message.date * 1000),
        text: ctx.message.text,
      },
    })
  })

export const collectReactionBotEvent: BotEvent = () =>
  bot.on('message_reaction', async (ctx) => {
    const { messageReaction, chat } = ctx
    const different = countReactionValue(
      messageReaction.new_reaction,
      messageReaction.old_reaction,
    )

    const foundMessage = await getMessage(chat.id)(messageReaction.message_id)

    if (!foundMessage) return
    const foundTelegramUser = await prisma.telegramUser.findFirst({
      where: {
        id: foundMessage.from_id,
      },
    })

    if (!foundTelegramUser) return

    await syncTelegramChat(messageReaction.chat.id, messageReaction.chat)

    if (messageReaction.user) {
      await syncTelegramUser(messageReaction.user.id, messageReaction.user)

      await prisma.reactionMessageEvent.create({
        data: {
          messageId: messageReaction.message_id,
          chatId: messageReaction.chat.id,
          fromId: messageReaction.user.id,
          date: new Date(messageReaction.date * 1000),
          toId: foundTelegramUser.id,
          newReaction: (
            messageReaction.new_reaction.filter(
              (reaction) => reaction.type === 'emoji',
            ) as ReactionTypeEmoji[]
          ).map((reaction) => reaction.emoji),
          oldReaction: (
            messageReaction.old_reaction.filter(
              (reaction) => reaction.type === 'emoji',
            ) as ReactionTypeEmoji[]
          ).map((reaction) => reaction.emoji),
          different: different,
        },
      })
    }

    // const { new_reaction, old_reaction, message_id, user } = ctx.messageReaction

    // if (
    //   old_reaction.find(
    //     (reaction) => reaction.type === 'emoji' && reaction.emoji === '🤝',
    //   ) &&
    //   user
    // ) {
    //   banUser(ctx)(user)
    // }

    // if (
    //   new_reaction.some(
    //     (reaction) => reaction.type === 'emoji' && reaction.emoji === '🤡',
    //   )
    // ) {
    //   writeClownCounter(ctx.chat.id)(foundMessage.from.id)(0)
    // }

    // writeReactionScore(ctx.chat.id)(foundMessage.from.id)(
    //   foundMember.data.reactionScore + reactionValue,
    // )

    if (different === 0) return

    if (messageReaction.user?.id === foundTelegramUser.id) return

    const cur = declOfNum(different, ['очко', 'очка', 'очков'])
    const user = messageReaction.user

    ctx.reply(
      `${foundTelegramUser.first_name} получил ${Math.abs(
        different,
      )} ${cur} социального ${
        different > 0 ? 'одобрения' : 'осуждения'
      } за ${messageReaction.new_reaction
        .map((reaction) => (reaction.type === 'emoji' ? reaction.emoji : '???'))
        .join(', ')} от ${user ? getUserName(user) : 'unknown'}`,
      {
        reply_parameters: {
          message_id: messageReaction.message_id,
        },
      },
    )
  })
