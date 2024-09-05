import { ReactionType, ReactionTypeEmoji } from 'grammy/types'
import { reactionToValue } from './features/economics/config'

export const countEmojiReactionValue = (reaction: ReactionTypeEmoji[]) =>
  reaction.reduce<number>((acc, reaction) => {
    const matchedReactionToValueRow = reactionToValue.find(
      ([reactionValues]) => {
        return reactionValues.find(
          (reactionValue) => reaction.emoji === reactionValue,
        )
      },
    )
    if (matchedReactionToValueRow) {
      return acc + matchedReactionToValueRow[1]
    }
    return acc
  }, 0)

export const countReactionValue = (
  new_reaction: ReactionType[],
  old_reaction: ReactionType[],
) => {
  const newEmojiReactionList = new_reaction.filter(
    (reaction) => reaction.type === 'emoji',
  ) as ReactionTypeEmoji[]
  const oldEmojiReactionList = old_reaction.filter(
    (reaction) => reaction.type === 'emoji',
  ) as ReactionTypeEmoji[]

  console.log('old:', oldEmojiReactionList)
  console.log('new:', newEmojiReactionList)

  return (
    countEmojiReactionValue(newEmojiReactionList) -
    countEmojiReactionValue(oldEmojiReactionList)
  )
}
