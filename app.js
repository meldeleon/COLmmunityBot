import "dotenv/config"
import express from "express"
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

import {
  HasGuildCommands,
  GetCommands,
  GetCommand,
  GetCommandsAttributes,
  DeleteGuildCommands,
  TEST_COMMAND,
  FACTION_COMMAND,
  JOIN_COMMAND,
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
        type: 9,
        data: {
          title: "My Cool Modal",
          custom_id: "cool_modal",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 4,
                  custom_id: "name",
                  label: "Name",
                  style: 1,
                  min_length: 1,
                  max_length: 4000,
                  placeholder: "John",
                  required: true,
                },
              ],
            },
          ],
        },
      })
    }
    if (custom_id === "faction_select")
      console.log(`faction number was selected by ${member.user.username}`)
  }
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
  // DELETE SCRIPT
  // GetCommandsAttributes(process.env.APP_ID, process.env.GUILD_ID, "id").then(
  //   (res) => {
  //     DeleteGuildCommands(process.env.APP_ID, process.env.GUILD_ID, res)
  //   }
  // )
  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    FACTION_COMMAND,
  ])
})
