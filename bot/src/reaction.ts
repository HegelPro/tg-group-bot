import { ReactionType } from "grammy/types"
import { reactionToValue } from "./features/economics/config"

export const countReactionValue = (new_reaction: ReactionType[]) => new_reaction.reduce<number>((acc, newReaction) => {
  const matchedReactionToValueRow = reactionToValue.find(([reactions]) => {
    return reactions.find(
      (reaction) =>
        newReaction.type === 'emoji' && newReaction.emoji === reaction,
    )
  })
  if (matchedReactionToValueRow) {
    return acc + matchedReactionToValueRow[1]
  }
  return acc
}, 0)