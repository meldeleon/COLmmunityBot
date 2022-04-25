//AWS and Dynamo DB
import AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

import "dotenv/config"
import express from "express"

//Discord shit that no one really likes
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions"
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js"

// Imported Faction Methods
import { createFactions } from "./faction.js"

// Imported Commands
import {
  HasGuildCommands,
  GetCommands,
  GetCommand,
  GetCommandsAttributes,
  DeleteGuildCommands,
  TEST_COMMAND,
  FACTION_COMMAND,
  JOIN_COMMAND,
  RESET_COMMAND,
  ASSIGN_COMMAND,
} from "./commands.js"

// Create an express app
const app = express()
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }))

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG })
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, custom_id } = data

    // "test" guild command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      console.log(`test command was run by ${member.user.username}`)
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world " + getRandomEmoji(),
        },
      })
    }
    if (name === "faction") {
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
    }
    if (name === "reset") {
      console.log(`factions and queue were reset by ${member.user.username}`)
      const colors = ["blue", "green", "red", "yellow"]
      //delete all existing factions
      colors.forEach((team) => {
        let params = {
          TableName: "col_factions",
          Key: {
            color: team,
          },
        }
        dynamodb.delete(params, function (err, data) {
          if (err) {
            console.error(
              "unable to push factions to dynamo DB",
              err,
              err.stack
            )
          } else {
            console.log(`faction has been deleted from Dynamo DB`)
          }
        })
      })
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content:
            `${member.user.username} has reset all faction assignments` +
            getRandomEmoji(),
        },
      })
    }
    if (name === "join") {
      let params = {
        TableName: "col_viewers",
        Item: {
          user_id: member.user.id,
          user_name: member.user.username,
          queued: true,
        },
      }
      dynamodb.put(params, function (err, data) {
        if (err) {
          console.error(
            `unable to add ${member.user.username} to viewers table.`,
            err,
            err.stack
          )
        } else {
          console.log(`${member.user.username} added to dynamo DB`)
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              // Fetches a random emoji to send from a helper function
              content:
                "HA! You're in! Now be ready to join your faction if you get picked. " +
                getRandomEmoji(),
              flags: 1 << 6,
            },
          })
        }
      })
    }
  }
  if (type === 3) {
    const { custom_id, values } = data
    if (custom_id === "faction_select") {
      console.log(`selected ${values}`)
      let factions = createFactions(values)

      factions.forEach((faction, index) => {
        let params = {
          TableName: "col_factions",
          Item: {
            color: faction.color,
            index: index,
            discord_channel: faction.discordChannel,
            users: faction.users,
          },
        }
        dynamodb.put(params, function (err, data) {
          if (err) {
            console.error(
              "unable to push factions to dynamo DB",
              err,
              err.stack
            )
          } else {
            console.log(`faction ${faction.color} added to dynamo DB`)
          }
        })
      })
    }
  }
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
  //DELETE SCRIPT
  // GetCommandsAttributes(process.env.APP_ID, process.env.GUILD_ID, "id").then(
  //   (res) => {
  //     DeleteGuildCommands(process.env.APP_ID, process.env.GUILD_ID, res)
  //   }
  // )
  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    FACTION_COMMAND,
    RESET_COMMAND,
    JOIN_COMMAND,
  ])
})
