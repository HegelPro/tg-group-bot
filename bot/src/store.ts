import fs from 'fs'
import * as T from 'io-ts'
import path from 'path'

const user = T.type({
  id: T.number,
  is_bot: T.boolean,
  first_name: T.string,
  // username: T.union([T.string, T.undefined]),
})
export type User = T.TypeOf<typeof user>

const memberData = T.type({
  reactionScore: T.number,
  clownCounter: T.number,
})

const member = T.type({
  user,
  data: memberData,
})
export type Member = T.TypeOf<typeof member>
export const createDefaultMember = (user: User): Member => ({
  user,
  data: {
    reactionScore: 0,
    clownCounter: 0
  },
})

const chat = T.type({
  id: T.number,
  title: T.union([T.string, T.undefined]),
  type: T.string,
})

const message = T.type({
  message_id: T.number,
  from: user,
  chat,
  date: T.number,
  text: T.union([T.string, T.undefined]),
})
export type Message = T.TypeOf<typeof message>

const chatInfoData = T.type({
  subscribed: T.boolean,
})

const chatInfo = T.type({
  id: T.number,
  members: T.array(member),
  messages: T.array(message),
  data: chatInfoData,
})
export type ChatInfo = T.TypeOf<typeof chatInfo>
export const createDefaultChatInfo = (chatId: number): ChatInfo => ({
  id: chatId,
  members: [],
  messages: [],
  data: {
    subscribed: true,
  },
})

const globalData = T.type({
  durovCounter: T.number,
  dailyTimestamp: T.number,
  hourlyTimestamp: T.number,
})
export const state = T.type({
  chatInfos: T.array(chatInfo),
  data: globalData,
})

export type State = T.TypeOf<typeof state>

const dbPath = path.join(__dirname, '..', 'db', 'production-db.json')

export function getState() {
  const __state__ = state.decode(JSON.parse(fs.readFileSync(dbPath, 'utf-8')))
  if (__state__._tag === 'Right') {
    return __state__.right
  } else {
    throw __state__.left
  }
}

export function updateState(updater: (state: State) => State) {
  const __state__ = getState()
  const updatedState = updater(__state__)
  fs.writeFileSync(dbPath, JSON.stringify(updatedState), 'utf-8')
}
