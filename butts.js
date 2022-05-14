import {
  assignAllUsers,
  selectUsersFromQueue,
  flipQueue,
  printTeams,
  getWhispers,
  join,
} from "./faction.js"

const testUsersId = Array(2)
  .fill()
  .map(() => Math.round(Math.random() * 10000000).toString())

const testQueue = testUsersId.map((x, index) => {
  return {
    user_id: x,
    user_name: `testName${x}`,
    queued: true,
    games_played: 0,
  }
})

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
  {
    color: "yellow",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    users: [],
  },
]

let test = assignAllUsers(testUsersId, factions)

console.log(printTeams(test))

const testMember = {
  user: {
    id: "239nfd3884209",
    username: "gettwitchy27",
  },
}
