import NodeCache from "node-cache"
import "dotenv/config"

//AWS and Dynamo DB configs
import AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

//globals
const myCache = new NodeCache()
const colors = ["blue", "green", "red", "yellow"]
const teamNames = ["Team Blue", "Team Green", " Team Red", "Team Yellow"]
const teamHeaders = [
  `:large_blue_diamond: ${teamNames[0]}: `,
  `:green_square: ${teamNames[1]}:`,
  `:heart: ${teamNames[2]}: `,
  `:yellow_circle: ${teamNames[3]}`,
]

export function createFactions(number) {
  let factions = []
  const discordChannels = [
    "https://discord.com/channels/965039544183431188/965077230952804362",
    "https://discord.com/channels/965039544183431188/965078950449647686",
    "https://discord.com/channels/965039544183431188/965078506759389194",
    "https://discord.com/channels/965039544183431188/967949179328544819",
  ]
  for (let i = 0; i < number; i++) {
    let faction = {
      color: colors[i],
      discordChannel: discordChannels[i],
      //users: ["109422963136208896", "279052991976308738"],
      users: [],
    }
    factions.push(faction)
  }
  return factions
}

export function printTeams(factions) {
  let printStatement = ``
  console.log(`the length of factions are ${factions.length}`)
  let usersList = []
  factions.forEach((faction) => {
    let factionTeamList = { name: faction.color, users: [] }
    faction.users.forEach((user) => {
      factionTeamList.users.push(`<@${user}>`)
    })
    usersList.push(factionTeamList)
  })
  console.log(usersList)
  switch (factions.length) {
    case 2:
      printStatement = `${teamHeaders[0]} ${usersList[0].users} \n${teamHeaders[1]} ${usersList[1].users}`
      break
    case 3:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[0].users}\n${teamHeaders[2]} ${usersList[2].users}`
      break
    case 4:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[0].users}\n${teamHeaders[2]} ${usersList[2].users}\n${teamHeaders[3]} ${usersList[3].users}`
      break
    default:
      console.log(`cannot print factions`)
  }
  return printStatement
}

export function assignUser(userId, factionColor) {
  const params = {
    TableName: "col_factions",
    Key: {
      color: factionColor,
    },
    UpdateExpression: "SET #u = list_append(#u, :newUser)",
    ExpressionAttributeNames: { "#u": "users" },
    ExpressionAttributeValues: {
      ":newUser": [userId],
    },
  }
  dynamodb.update(params, function (err, data) {
    if (err) console.log(err)
    else console.log(`Added ${userId} to ${factionColor}`)
  })
}

export function assignAllUsers(userIds) {
  let factions = getFactions()
  switch (factions.length) {
    case 2:
      userIds.forEach((useriD, index) => {
        if (index % 2 === 0) {
          factions[0].users.push(userId)
        } else {
          faction[1].users.push(userId)
        }
      })

      break
    case 3:
      break
    case 4:
      break
  }
  console.log(teams)
}

export function getFactions() {
  const factionParams = {
    TableName: "col_factions",
    AttributesToGet: ["color", "discord", "index", "users"],
  }
  dynamodb.scan(factionParams, function (err, data) {
    if (err) {
      console.log("Failed to fetch queued users", err)
    } else {
      let results = data.Items
      return results
    }
  })
}

// export async function getQueuedUsers(number) {
//   const params = {
//     FilterExpression: "queued = :q",
//     ExpressionAttributeValues: {
//       ":q": true,
//     },
//     ProjectionExpression: "user_id",
//     TableName: "col_viewers",
//     Limit: number,
//   }
//   dynamodb.scan(params, function (err, data) {
//     if (err) {
//       console.log("Failed to fetch queued users", err)
//     } else {
//       const success = myCache.set(
//         "queued",
//         data.Items.map((user) => user.user_id),
//         100000
//       )
//       console.log(`cached: ${success}`)
//     }
//   })
// }

// export async function assignAllUsers(number) {
//   let users = await getQueuedUsers(number).then((res) => console.log(res))
// }

// assignAllUsers(2)
//mentions looks like <@user_id> like <@86890631690977280> more: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
