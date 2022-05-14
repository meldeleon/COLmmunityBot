//third party lib dependencies
import "dotenv/config"
import AsciiTable from "ascii-table"

//globals to name the Teams, and set Discord Channes
const colors = ["blue", "green", "red", "yellow"]
const teamNames = ["Team Blue", "Team Green", " Team Red", "Team Yellow"]
const teamHeaders = [
  `:large_blue_diamond: ${teamNames[0]}: `,
  `:green_square: ${teamNames[1]}:`,
  `:heart: ${teamNames[2]}: `,
  `:yellow_circle: ${teamNames[3]}`,
]
const discordChannels = [
  "https://discord.com/channels/965039544183431188/965077230952804362",
  "https://discord.com/channels/965039544183431188/965078950449647686",
  "https://discord.com/channels/965039544183431188/965078506759389194",
  "https://discord.com/channels/965039544183431188/967949179328544819",
]
export const roleIds = [
  "965071590293393438", // blue
  "965071669007908934", // green
  "965071787316609045", // red
  "967943791644397689", // yellow
]

//creates initial factions objects in an array
export function createFactions(numberOfFactions) {
  let factions = []
  let max = Math.ceil(57 / numberOfFactions)
  for (let i = 0; i < numberOfFactions; i++) {
    let faction = {
      color: colors[i],
      discordChannel: discordChannels[i],
      //users are by id, ex: ["109422963136208896", "279052991976308738"],
      users: [],
      maxUsers: max,
      roleId: roleIds[i],
    }
    factions.push(faction)
  }
  return factions
}

export function checkSize(faction) {
  if (users.length < faction.maxUsers) {
    return true
  } else {
    return false
  }
}

//prints teams for discord responses. RETURNS PRINT STATEMENT.
export function printTeams(factions) {
  let printStatement = ``
  //console.log(`the length of factions are ${factions.length}`);
  let usersList = []
  factions.forEach((faction) => {
    let factionTeamList = { name: faction.color, users: [] }
    faction.users.forEach((user) => {
      factionTeamList.users.push(`<@${user}>`)
    })
    usersList.push(factionTeamList)
  })
  //console.log(usersList);
  switch (factions.length) {
    case 2:
      printStatement = `${teamHeaders[0]} ${usersList[0].users} \n${teamHeaders[1]} ${usersList[1].users}`
      break
    case 3:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[1].users}\n${teamHeaders[2]} ${usersList[2].users}`
      break
    case 4:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[1].users}\n${teamHeaders[2]} ${usersList[2].users}\n${teamHeaders[3]} ${usersList[3].users}`
      break
    default:
      console.log(`cannot print factions`)
  }
  return printStatement
}

//assign one user to one team. RETURNS FACTIONS ARRAY.
export function assignUser(userId, team, factions) {
  let matchedTeam = 0
  let reachedMaximum = false
  let lowerCaseTeam = team.toLowerCase()
  let newfactions = factions.map((faction) => {
    //check if iterated faction is the correct team
    if (faction.color === lowerCaseTeam) {
      //check if faction is at max users
      if (faction.maxUsers > faction.users.length) {
        let updatedFaction = { ...faction }
        updatedFaction.users.push(userId)
        matchedTeam++
        return updatedFaction
      } else {
        reachedMaximum = true
        return { ...faction }
      }
    } else {
      return { ...faction }
    }
  })
  //log for invalid team
  if (matchedTeam === 0) {
    console.log("invalid team was input")
    return false
  }
  //log for max users
  else if (reachedMaximum === true) {
    console.log("maximum number of users in this faction")
  } else {
    console.log(`upated factions: ${printTeams(newfactions)}`)
    return newfactions
  }
}

//unassigns one user from any factions they may be assigned to. RETURNS FACTION ARRAY.
export function unassign(userId, factions) {
  let newFactions = factions.map((faction) => {
    return { ...faction }
  })
  factions.forEach((faction, factionIndex) => {
    faction.users.forEach((user, userIndex) => {
      if (user === userId) {
        newFactions[factionIndex].users.splice(userIndex, 1)
        console.log(
          `unassigned ${userId} from faction ${factions[factionIndex].color}`
        )
      }
    })
  })
  return newFactions
}

//unassigns all users from factions. RETURNS FACTION ARRAY.
export function unassignAll(factions) {
  let newFactions = factions.map((faction) => {
    return { ...faction }
  })
  newFactions.forEach((faction) => {
    faction.users = []
  })
  return newFactions
}

//assigns queued users evenly across factions randomly. RETURNS FACTION ARRAY.
export function assignAllUsers(userIds, factions) {
  //TODO: IF USER LIST IS LARGER THAN 57, RANDOMLY SELECT 57 OF THEM.
  let assignedFactions = factions.map((faction) => {
    return { ...faction }
  })
  switch (assignedFactions.length) {
    case 2:
      userIds.forEach((userId, index) => {
        if (index % 2 === 0) {
          assignedFactions[1].users.push(userId)
        } else {
          assignedFactions[0].users.push(userId)
        }
      })
      break
    case 3:
      userIds.forEach((userId, index) => {
        if (index % 3 === 0) {
          assignedFactions[2].users.push(userId)
        } else if (index % 3 === 1) {
          console.log(`assigned ${userId} to ${assignedFactions[1].color}`)
          assignedFactions[1].users.push(userId)
        } else {
          assignedFactions[0].users.push(userId)
        }
      })
      break
    case 4:
      userIds.forEach((userId, index) => {
        if (index % 4 === 0) {
          assignedFactions[3].users.push(userId)
        } else if (index % 4 === 1) {
          assignedFactions[2].users.push(userId)
        } else if (index % 4 === 2) {
          assignedFactions[1].users.push(userId)
        } else {
          assignedFactions[0].users.push(userId)
        }
      })
      break
  }
  return assignedFactions
}

//marks all assigned users as not queued in queue. RETURNS QUEUE ARRAY.
export function flipQueue(queue, factions) {
  let assignedUsers = []
  factions.forEach((faction) => {
    faction.users.forEach((userId) => {
      assignedUsers.push(userId)
    })
  })

  let newQueue = queue.map((user) => {
    return { ...user }
  })
  //console.log(newQueue)
  newQueue.forEach((user, index) => {
    newQueue[index].queued = false
    if (assignedUsers.indexOf(user.user_id) != -1) {
      newQueue[index].games_played++
    }
  })
  return newQueue.sort(function (a, b) {
    return a.games_played - b.games_played
  })
}

//generates whispers for all assigned users. RETURNS WHISPERS ARRAY.
export function getWhispers(factions) {
  let whisperQueue = []
  factions.forEach((faction) => {
    faction.users.forEach((user) => {
      let whisperObj = {
        userId: user,
        msg: `You have been assigned to Team ${faction.color}, please join your team in voice: ${faction.discordChannel}`,
      }
      whisperQueue.push(whisperObj)
    })
  })
  return whisperQueue
}

// selects 57 or less joined users from the queue and priortizes us
export function selectUsersFromQueue(queue) {
  let joinedUsers = queue.filter((user) => user.queued === true)
  //TODO: REPLACE 5 WITH MAX GAMES PLAYED FOR USERS IN QUEUE
  let selectedQueue = []
  for (let i = 0; i < 5; i++) {
    let filteredList = joinedUsers.filter((user) => user.games_played === i)
    filteredList.forEach((user) => {
      if (selectedQueue.length < 57) {
        selectedQueue.push(user.user_id)
      }
    })
  }
  return selectedQueue
}

// add a user to the queue, RETURNS A NEW QUEUE
export function join(queue, member) {
  let viewer = {
    user_id: member.user.id,
    user_name: member.user.username,
    queued: true,
    games_played: 0,
  }
  let newQueue = []
  if (queue != undefined) {
    newQueue = queue.map((user) => {
      return { ...user }
    })
    let isDupe = false
    queue.forEach((user, index) => {
      if (user.user_id === viewer.user_id) {
        //
        isDupe = true
        newQueue[index].queued = true
      }
    })
    if (!isDupe) {
      newQueue.push(viewer)
    }
  } else {
    newQueue.push(viewer)
  }
  return newQueue
}

//prints the current queue, RETURN CONTENT FOR DISCORD RESPONSE
export function printQueue(queue) {
  let rowArray = queue.map((user, index) => {
    return [index, user.user_name, user.queued, user.games_played]
  })
  let jsonQueue = {
    title: "Faction Queue",
    heading: ["#", "user name", "queued", "games played"],
    rows: rowArray,
  }
  let table = new AsciiTable().fromJSON(jsonQueue)
  let responseString = `\`\`\` ${table} \`\`\``
  return responseString
}

//mentions looks like <@user_id> like <@86890631690977280> more: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
