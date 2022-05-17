//third party lib dependencies
import "dotenv/config"
import express from "express"
import NodeCache from "node-cache"
const appCache = new NodeCache()

//These are all imports from sample code, delete unused when done, maybe re-write interaction type since it doesnt work half the time.
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions"

import {
  verifydiscordRequest,
  getRandomEmoji,
  discordRequest,
  memberAdmin,
  notAdminMsg,
  testQueue,
} from "./utils.js"

// Imported Faction Methods
import {
  createFactions,
  printTeams,
  assignAllUsers,
  assignUser,
  unassign,
  unassignAll,
  flipQueue,
  join,
  printQueue,
} from "./faction.js"

// Imported Commands
import {
  assignRolesWait,
  hasGuildCommands,
  getGuildMembers,
  TEST_COMMAND,
  START_FACTION_COMMAND,
  JOIN_COMMAND,
  RESET_COMMAND,
  ASSIGN_COMMAND,
  ASSIGN_ALL_COMMAND,
  UNASSIGN_COMMAND,
  PRINT_FACTIONS_COMMAND,
  UNASSIGN_ALL_COMMAND,
  PRINT_QUEUE_COMMAND,
  START_WAR_COMMAND,
  RESET_ROLES_COMMAND,
} from "./commands.js"

// Create an express app
const app = express()
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: verifydiscordRequest(process.env.PUBLIC_KEY) }))

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body
  //Handle verification requests
  const isAdmin = memberAdmin(member)

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG })
  }

  // Handle slash command requests. See https://discord.com/developers/docs/interactions/application-commands#slash-commands

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, custom_id } = data
    // "test" guild command
    if (name === "test") {
      if (isAdmin) {
        console.log(await getGuildMembers(process.env.GUILD_ID))
        console.log("pushed test Queue to cache")
        // Send a message into the channel where command was triggered from
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: "this is a test command",
          },
        })
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "start_faction") {
      if (isAdmin) {
        console.log(`faction command was run by ${member.user.username}`)
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "How many factions?",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 3,
                    custom_id: "faction_select",
                    options: [
                      {
                        label: "2 Factions",
                        value: "2",
                      },
                      {
                        label: "3 Factions",
                        value: "3",
                      },
                      {
                        label: "4 Factions",
                        value: "4",
                      },
                    ],
                    placeholder: "Choose a number of factions.",
                    min_values: 1,
                    max_values: 1,
                  },
                ],
              },
            ],
          },
        })
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "reset") {
      if (isAdmin) {
        console.log(`factions and queue were reset by ${member.user.username}`)
        appCache.flushAll()

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content:
              `factions and queue were reset by ${member.user.username}` +
              getRandomEmoji(),
          },
        })
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: "You must be an admin to run that command",
          },
        })
      }
    }
    if (name === "join") {
      let currentQueue = appCache.get("queue")
      let newQueue = join(currentQueue, member)
      appCache.set("queue", newQueue, 100000)
      console.log(appCache.get("queue"))
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content:
            "HA! You're in! Now be ready to join your faction if you get picked. " +
            getRandomEmoji(),
          flags: 1 << 6, //ephemeral msg flag
        },
      })
    }
    if (name === "assign") {
      if (isAdmin) {
        // assign will assign a specific person to one faction
        let currentFactions = appCache.get("factions")
        if (currentFactions === undefined) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You must first initiate a faction war by typing /faction and picking how many factions you want`,
            },
          })
        } else {
          let viewer = await req.body.data.options[0].value
          let targetFaction = await req.body.data.options[1].value
          console.log(viewer, targetFaction)
          let updatedFactions = assignUser(
            viewer,
            targetFaction,
            currentFactions
          )
          appCache.set("factions", updatedFactions)
          console.log(appCache.get("factions"))
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `**<@${viewer}>has been assigned to team ${targetFaction}**`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "assign_all") {
      if (isAdmin) {
        //assign all uses to a random faction
        let currentFactions = appCache.get("factions")
        let currentQueue = appCache.get("queue")
        if (currentQueue && currentFactions) {
          let queuedUsers = currentQueue.map((user) => {
            return user.user_id
          })
          let newFactions = assignAllUsers(queuedUsers, currentFactions)
          appCache.set("factions", newFactions)
          let factionTeamList = printTeams(newFactions)
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${member.user.username} has assigned all queued users to factions: \n ${factionTeamList}`,
            },
          })
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `There is no one in queue to assign or there are factions initiated.`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "unassign") {
      if (isAdmin) {
        let viewer = await req.body.data.options[0].value
        let factions = appCache.get("factions")
        if (factions) {
          appCache.set("factions", unassign(viewer, factions))
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `**<@${viewer}> has been unassigned**`,
            },
          })
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You cannot unassign users until you create a faction`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "unassign_all") {
      if (isAdmin) {
        let factions = appCache.get("factions")
        if (factions) {
          appCache.set("factions", unassignAll(factions))
          console.log(`${member.user.username} unassigned all users`)
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${
                member.user.username
              } unassigned all users: \n ${printTeams(
                appCache.get("factions")
              )}`,
            },
          })
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You cannot unassign users until you create a faction`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "print_factions") {
      let currentFactions = await appCache.get("factions")
      if (currentFactions) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: printTeams(currentFactions),
          },
        })
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `No factions exist yet to be printed.`,
          },
        })
      }
    }
    if (name === "print_queue") {
      let currentQueue = appCache.get("queue")
      if (currentQueue) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: printQueue(currentQueue),
          },
        })
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `There is currently no queue to print. Ask people to /join!`,
          },
        })
      }
    }
    if (name === "reset_roles") {
      if (isAdmin) {
        let currentQueue = appCache.get("queue")
        if (currentQueue) {
          let userIds = currentQueue.map((user) => user.user_id)
          unassignRolesMultiplePeople(process.env.GUILD_ID, userIds)
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${member.user.username} reset faction roles for all members in queue.`,
            },
          })
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `There is no one in queue to unassign roles.`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
    if (name === "start_war") {
      if (isAdmin) {
        let currentFactions = appCache.get("factions")
        let currentQueue = appCache.get("queue")
        if (currentFactions && currentQueue) {
          appCache.set("queue", flipQueue(currentQueue, currentFactions))
          for await (const faction of currentFactions) {
            assignRolesWait(process.env.GUILD_ID, faction.users, faction.roleId)
          }
          // print all current faction assignments
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `HERE ARE THE FINAL FACTIONS, JOIN YOUR VOICE CHANNEL:\n ${printTeams(
                appCache.get("factions")
              )}`,
            },
          })
        } else {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `You must create a faction and have people type /join first.`,
            },
          })
        }
      } else {
        return notAdminMsg(res, InteractionResponseType)
      }
    }
  }
  if (type === 3) {
    if (isAdmin) {
      // listening for when an admin chooses the number of factions
      const { custom_id, values } = data
      // creates factions and pushes them to dynamo DB, alerts channel that factions have been created.
      if (custom_id === "faction_select") {
        console.log(`selected ${values}`)
        let factions = createFactions(values)
        let factionTeamList = printTeams(factions)
        appCache.set("factions", factions, 100000000)
        console.log(appCache.get("factions"))
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: `**${member.user.username} has created a faction war, type /join to queue up for the war!**\n factions: \n ${factionTeamList}`,
          },
        })
      }
    } else {
      return notAdminMsg(res, InteractionResponseType)
    }
  }
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
  //DELETE SCRIPT
  // getCommandsAttributes(process.env.APP_ID, process.env.GUILD_ID, "id").then(
  //   (res) => {
  //     DeleteGuildCommands(process.env.APP_ID, process.env.GUILD_ID, res)
  //   }
  // )
  // GetScript
  // console.log(
  //   getCommandsAttributes(process.env.APP_ID, process.env.GUILD_ID, "id")
  // )
  // DeleteGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
  //   "974565739816185876",
  // ])

  //INSTALLATION SCRIPT
  hasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    START_FACTION_COMMAND,
    RESET_COMMAND,
    JOIN_COMMAND,
    ASSIGN_COMMAND,
    ASSIGN_ALL_COMMAND,
    UNASSIGN_COMMAND,
    UNASSIGN_ALL_COMMAND,
    PRINT_FACTIONS_COMMAND,
    PRINT_QUEUE_COMMAND,
    START_WAR_COMMAND,
    RESET_ROLES_COMMAND,
  ])
})
