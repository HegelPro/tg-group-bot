import { getChatInfos } from "./gets";
import { ChatInfo, updateState } from "./store";

export const writeDurovCounter = (durovCounter: number) => updateState((state) => ({
  ...state,
  data: { ...state.data, durovCounter },
}))

export const writeHourlyTimestamp = (hourlyTimestamp: number) => updateState((state) => ({
  ...state,
  data: {
    ...state.data,
    hourlyTimestamp,
  },
}))

export const writeDailyTimestamp = (dailyTimestamp: number) => updateState((state) => ({
  ...state,
  data: {
    ...state.data,
    dailyTimestamp,
  },
}))

export const writeChatInfos = (chatInfos: ChatInfo[]) => updateState((state) => ({
  ...state,
  chatInfos,
}))

export const writeReactionScore = (chatId: number) => (memberId: number) => (reactionScore: number) => {
  const chatInfos = getChatInfos().map((chatInfo) =>
    chatInfo.id === chatId
      ? {
          ...chatInfo,
          members: chatInfo.members.map((member) =>
            member.user.id === memberId
              ? {
                  ...member,
                  data: {
                    ...member.data,
                    reactionScore,
                  },
                }
              : member,
          ),
        }
      : chatInfo,
  )
  writeChatInfos(chatInfos)
}

export const writeClownCounter = (chatId: number) => (memberId: number) => (clownCounter: number) => {
  const chatInfos = getChatInfos().map((chatInfo) =>
    chatInfo.id === chatId
      ? {
          ...chatInfo,
          members: chatInfo.members.map((member) =>
            member.user.id === memberId
              ? {
                  ...member,
                  data: {
                    ...member.data,
                    clownCounter,
                  },
                }
              : member,
          ),
        }
      : chatInfo,
  )
  writeChatInfos(chatInfos)
}