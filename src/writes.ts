import { prisma } from './db'

// export const writeChatInfos = (chatInfos: ChatInfo[]) =>
//   updateState((state) => ({
//     ...state,
//     chatInfos,
//   }))

// export const writeReactionScore =
//   (chatId: number) => (memberId: number) => (reactionScore: number) => {
//     const chatInfos = getChatInfos().map((chatInfo) =>
//       chatInfo.id === chatId
//         ? {
//             ...chatInfo,
//             members: chatInfo.members.map((member) =>
//               member.user.id === memberId
//                 ? {
//                     ...member,
//                     data: {
//                       ...member.data,
//                       reactionScore,
//                     },
//                   }
//                 : member,
//             ),
//           }
//         : chatInfo,
//     )
//     writeChatInfos(chatInfos)
//   }

// export const writeClownCounter =
//   (chatId: number) => (memberId: number) => (clownCounter: number) => {
//     const chatInfos = getChatInfos().map((chatInfo) =>
//       chatInfo.id === chatId
//         ? {
//             ...chatInfo,
//             members: chatInfo.members.map((member) =>
//               member.user.id === memberId
//                 ? {
//                     ...member,
//                     data: {
//                       ...member.data,
//                       clownCounter,
//                     },
//                   }
//                 : member,
//             ),
//           }
//         : chatInfo,
//     )
//     writeChatInfos(chatInfos)
//   }
