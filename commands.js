import { response } from "express"
import { capitalize, DiscordRequest } from "./utils.js"

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return

  commands.forEach((c) => HasGuildCommand(appId, guildId, c))
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`

  try {
    const res = await DiscordRequest(endpoint, { method: "GET" })
    const data = await res.json()

    if (data) {
      const installedNames = data.map((c) => c["name"])
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`)
        InstallGuildCommand(appId, guildId, command)
      } else {
        console.log(`"${command["name"]}" command already installed`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`
  // install command
  try {
    await DiscordRequest(endpoint, { method: "POST", body: command })
  } catch (err) {
    console.error(err)
  }
}

//Get all commands
export async function GetCommands(appId, guildId) {
  // API endpoint to retrieve all commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`
  try {
    const res = await DiscordRequest(endpoint, { method: "GET" })
    const cmds = await res.json()
    console.log(cmds)
    return cmds
  } catch (err) {
    console.log(err)
  }
}

//gets a single guild command
export function GetCommand(appId, guildId, commandName) {
  const cmd = GetCommands(appId, guildId).then((res) =>
    res.filter((c) => c.name === commandName)
  )
  return cmd
}

//delete all commands
export async function DeleteGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return
  commands.forEach((c) => DeleteGuildCommand(appId, guildId, c))
}

// deletes command
export async function DeleteGuildCommand(appId, guildId, commandId) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands/${commandId}`
  // install command
  try {
    await DiscordRequest(endpoint, { method: "DELETE" })
    console.log(`${commandId} has been deleted`)
  } catch (err) {
    console.error(err)
  }
}

export async function GetCommandsAttributes(appId, guildId, attribute) {
  let attributes = []
  const commands = await GetCommands(appId, guildId)
  commands.forEach((cmd) => {
    attributes.push(cmd[attribute])
  })
  console.log(attributes)
  return attributes
}

// Simple test command
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

// Faction command
export const FACTION_COMMAND = {
  name: "faction",
  description: "Create a faction war game",
  type: 1,
}
