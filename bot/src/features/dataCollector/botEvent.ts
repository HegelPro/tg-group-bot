import { ReactionTypeEmoji } from 'grammy/types'
import { bot } from '../../bot'
import { BotEvent } from '../../botEvents'
import { prisma } from '../../db'
import { getMember, getMessage } from '../../gets'
import { countReactionValue } from '../../reaction'
// import { getChatInfos } from '../../gets'
// import { createDefaultChatInfo, Message } from '../../store'
// import { insertDefaultIfNotFound } from '../../utils'
// import { writeChatInfos } from '../../writes'

// const addMessageToChatInfo = (chatId: number) => (message: Message) => {
//   const chatInfos = insertDefaultIfNotFound(getChatInfos())(
//     (chat) => chat.id === chatId,
//   )(createDefaultChatInfo(chatId)).map((chatInfo) =>
//     chatInfo.id === chatId
//       ? {
//           ...chatInfo,
//           messages: [...chatInfo.messages, message],
//         }
//       : chatInfo,
//   )
//   writeChatInfos(chatInfos)
// }

export const collectMessageBotEvent: BotEvent = () =>
  bot.on('message', async (ctx) => {
    console.log('message event')
    const res1 = await prisma.telegramChat.upsert({
      where: {
        id: ctx.chat.id,
      },
      update: {},
      create: ctx.chat,
    })
    console.log('telegramChat.upserted:', res1)

    const res2 = await prisma.telegramUser.upsert({
      where: {
        id: ctx.message.from.id,
      },
      update: {},
      create: ctx.message.from,
    })

    console.log('telegramUser.upserted:', res2)

    const res3 = await prisma.messageEvent.create({
      data: {
        from_id: ctx.message.from.id,
        chat_id: ctx.chat.id,
        id: ctx.message.message_id,
        date: new Date(ctx.message.date),
        text: ctx.message.text,
      },
    })
    console.log('messageEvent.created:', res3)
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

    await prisma.telegramChat.upsert({
      where: {
        id: messageReaction.chat.id,
      },
      update: {},
      create: messageReaction.chat,
    })
    if (messageReaction.user) {
      await prisma.telegramUser.upsert({
        where: {
          id: messageReaction.user.id,
        },
        update: {},
        create: messageReaction.user,
      })
      await prisma.reactionMessageEvent.create({
        data: {
          messageId: messageReaction.message_id,
          chatId: messageReaction.chat.id,
          fromId: messageReaction.user.id,
          date: new Date(messageReaction.date),
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

    ctx.reply(
      `${
        foundTelegramUser.first_name
      } получил ${different} респекта за ${messageReaction.new_reaction
        .map((reaction) => (reaction.type === 'emoji' ? reaction.emoji : '???'))
        .join(', ')} от ${messageReaction.user?.first_name || 'unknown'}`,
        {'reply_parameters': {
          message_id: messageReaction.message_id
        }}
    )
  })
