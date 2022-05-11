import {
  assignAllUsers,
  selectUsersFromQueue,
  flipQueue,
  printTeams,
  getWhispers,
  join,
} from "./faction.js"

const testUsersId = Array(3)
  .fill()
  .map(() => Math.round(Math.random() * 10000000).toString())

const testQueue = testUsersId.map((x, index) => {
  if (index % 2 === 0) {
    return {
      user_id: x,
      user_name: `testName${x}`,
      queued: true,
      games_played: 0,
    }
  } else {
    return {
      user_id: x,
      user_name: `testName${x}`,
      queued: true,
      games_played: 0,
    }
  }
})

const testMember = {
  user: {
    id: "239nfd3884209",
    username: "gettwitchy27",
  },
}
const factions = [
  {
    color: "blue",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    users: [],
  },
  {
    color: "green",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    users: [],
  },
]

let test = join(testQueue, testMember)
console.table(test)

let test2 = join(test, testMember)
console.table(test2)

let assignedFactions = assignAllUsers(selectUsersFromQueue(test2), factions)
let test3 = flipQueue(test2, assignedFactions)
console.table(test3)

let test4 = join(test3, testMember)
console.table(test4)
