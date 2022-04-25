/*
faction.js
CREATE Command [ADMIN]
- Takes interaction object, and creates data objects for each faction, assigns number of open slots for each faction.

JOIN Command [USER]
- Takes interaction object from user, and assigned them to a faction, gives them faction roles, which allows them to join appropriate voice channel.
- Sends the user an ephemeral message telling them their faction assignment and prompting them to join channel.

LOCK Command [ADMIN]
- Locks assigned teams.
- Prints roster to channel
- Creates/updates user objects for future selection to DB.


USER Objects:
{
    id: 334385199974967042,
    times_joined: 3,
    last_date_joined: "YYYY-MM-DD"
}
*/

//AWS and Dynamo DB
import AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

//example data block

export function createFactions(number) {
  let factions = []
  const colors = ["blue", "green", "red", "yellow"]
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
      users: [],
    }
    factions.push(faction)
  }
  return factions
}

export function insertUser(name, id, numberOfFactions) {
  // usersNeeded[0] is 2 factions, [1] is 3 factions, and [2] is four factions
  let usersNeeded = [58, 57, 56]
}

// export function assignFaction(users, id, factions) {
//   for

//   let user = {
//     userName: name,
//     userId: id,
//   }

// }

//mentions looks like <@user_id> like <@86890631690977280> more: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
