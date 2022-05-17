import { discordRequest } from "./utils.js"
export async function hasGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return

  commands.forEach((c) => hasGuildCommand(appId, guildId, c))
}

// Checks for a command
async function hasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`
  try {
    const res = await discordRequest(endpoint, { method: "GET" })
    const data = await res.json()
    if (data) {
      const installedNames = data.map((c) => c["name"])
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`)
        installGuildCommand(appId, guildId, command)
      } else {
        console.log(`"${command["name"]}" command already installed`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// Installs a command
export async function installGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`
  // install command
  try {
    await discordRequest(endpoint, { method: "POST", body: command })
  } catch (err) {
    console.error(err)
  }
}

//Get all commands
export async function getCommands(appId, guildId) {
  // API endpoint to retrieve all commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`
  try {
    const res = await discordRequest(endpoint, { method: "GET" })
    const cmds = await res.json()
    console.log(cmds)
    return cmds
  } catch (err) {
    console.log(err)
  }
}

//gets a single guild command
export function getCommand(appId, guildId, commandName) {
  const cmd = getCommands(appId, guildId).then((res) =>
    res.filter((c) => c.name === commandName)
  )
  return cmd
}

//delete all commands
export async function deleteGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return
  commands.forEach((c) => deleteGuildCommand(appId, guildId, c))
}

// deletes command
export async function deleteGuildCommand(appId, guildId, commandId) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`
  // install command
  try {
    await discordRequest(endpoint, { method: "DELETE" })
    console.log(`${commandId} has been deleted`)
  } catch (err) {
    console.error(err)
  }
}

export async function getCommandsAttributes(appId, guildId, attribute) {
  let attributes = []
  const commands = await getCommands(appId, guildId)
  commands.forEach((cmd) => {
    attributes.push(cmd[attribute])
  })
  console.log(attributes)
  return attributes
}

//assigns a role to a user
export async function assignRole(guildId, userId, roleId) {
  const endpoint = `guilds/${guildId}/members/${userId}/roles/${roleId}`
  try {
    console.log("trying to request role assign")
    await discordRequest(endpoint, { method: "PUT" })
  } catch (err) {
    console.error(err)
  }
}

export function waitMs(ms) {
  console.log(`waiting ${ms} ms`)
  return new Promise((res) => {
    setTimeout(() => {
      res("resolved")
    }, ms)
  })
}

export async function assignRolesWait(guildId, userIds, roleId) {
  for await (const userId of userIds) {
    assignRole(guildId, userId, roleId)
    waitMs(5000)
  }
}

export async function unAssignRole(guildId, userId, roleId) {
  const endpoint = `guilds/${guildId}/members/${userId}/roles/${roleId}`
  try {
    console.log("trying to request role assign")
    await discordRequest(endpoint, { method: "DELETE" })
  } catch (err) {
    console.error(err)
  }
}

export async function unassignRolesWait(guildId, userIds, roleId) {
  for await (const userId of userIds) {
    unAssignRole(guildId, userId, roleId)
    waitMs(5000)
  }
}

export async function getGuildMembers(guildId) {
  const endpoint = `guilds/${guildId}/members?limit=1000`
  try {
    let guildMembers = await discordRequest(endpoint, { method: "GET" })
    return guildMembers.json()
  } catch (err) {
    console.log(err)
  }
}

export const TEST_COMMAND = {
  name: "test",
  description: "Basic guild command",
  type: 1,
}

export const JOIN_COMMAND = {
  name: "join",
  description: "Join a faction for the faction war game",
  type: 1,
}

export const START_FACTION_COMMAND = {
  name: "start_faction",
  description: "Create a faction war game.",
  type: 1,
}

export const ASSIGN_COMMAND = {
  name: "assign",
  description: "To assign a specific user to a specific faction.",
  options: [
    {
      type: 6,
      name: "viewer",
      description: "Pick a user to assign to a faction.",
      required: true,
    },
    {
      type: 3,
      name: "faction",
      description: "Pick a faction to assign the user to.",
      required: true,
      style: 1,
    },
  ],
}

export const UNASSIGN_COMMAND = {
  name: "unassign",
  description: "To assign a specific user to a specific faction.",
  options: [
    {
      type: 6,
      name: "viewer",
      description: "Pick a user to unassign.",
      required: true,
    },
  ],
}

export const UNASSIGN_ALL_COMMAND = {
  name: "unassign_all",
  description: "Unassign all users from factions, retain factions",
  type: 1,
}

export const ASSIGN_ALL_COMMAND = {
  name: "assign_all",
  description: "Assign all queued users to random factions",
  type: 1,
}

export const RESET_COMMAND = {
  name: "reset",
  description: "Reset a faction war game.",
  type: 1,
}

export const PRINT_FACTIONS_COMMAND = {
  name: "print_factions",
  description: "Print all current faction assignments.",
  type: 1,
}

export const START_WAR_COMMAND = {
  name: "start_war",
  description: "Begin the faction war.",
  type: 1,
}
export const PRINT_QUEUE_COMMAND = {
  name: "print_queue",
  description: "Print the list of queued players",
  type: 1,
}

export const RESET_ROLES_COMMAND = {
  name: "reset_roles",
  description: "Reset all the faction roles",
  type: 1,
}
