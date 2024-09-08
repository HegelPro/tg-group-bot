import { ReactionTypeEmoji } from "grammy/types";

export const reactionToValue: [ReactionTypeEmoji['emoji'][], number][] = [
  [["😈"], 7],
  [["❤‍🔥"], 6],
  [["❤", "🏆"], 5],
  [["🥰", "🔥", "🤣", "😎", "🤩"], 3],
  [["👍", "💯", "😍", "⚡", "🤝", "🤗", "🆒", "😘", "😁", "💋"], 1],
  [["👎", "🥱"], -1],
  [["🤮", "💩"], -3],
  [["🤡"], -5],
]