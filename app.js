//third party lib dependencies
import AsciiTable from "ascii-table";
import "dotenv/config";
import express from "express";
import NodeCache from "node-cache";
const appCache = new NodeCache();

//These are all imports from sample code, delete unused when done, maybe re-write interaction type since it doesnt work half the time.
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";
import {
  VerifyDiscordRequest,
  getRandomEmoji,
  DiscordRequest,
} from "./utils.js";

// Imported Faction Methods
import { createFactions, printTeams, assignAllUsers } from "./faction.js";

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
  ASSIGN_ALL_COMMAND,
} from "./commands.js";
import e from "express";

// Create an express app
const app = express();
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body;
  //Handle verification requests

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle slash command requests. See https://discord.com/developers/docs/interactions/application-commands#slash-commands

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, custom_id } = data;

    // "test" guild command
    if (name === "test") {
      console.log(appCache.get("factions"));

      // Send a message into the channel where command was triggered from
      console.log(`test command was run by ${member.user.username}`);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "this is a test command",
        },
      });
    }
    if (name === "faction") {
      console.log(`faction command was run by ${member.user.username}`);
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
      });
    }
    if (name === "reset") {
      console.log(`factions and queue were reset by ${member.user.username}`);
      appCache.flushAll();

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content:
            `${member.user.username} has reset all faction assignments ` +
            getRandomEmoji(),
        },
      });
    }
    if (name === "join") {
      let viewer = {
        user_id: member.user.id,
        user_name: member.user.username,
        queued: true,
      };
      let currentQueue = appCache.get("queue");
      let newQueue = [];
      if (currentQueue) {
        let isDupe = false;
        currentQueue.forEach((x) => {
          if (x.user_id === viewer.user_id) {
            isDupe = true;
          } else {
            newQueue.push(x);
          }
        });
        if (!isDupe) {
          newQueue.push(viewer);
        }
      } else {
        newQueue.push(viewer);
      }
      appCache.set("queue", newQueue, 100000);
      console.log(appCache.get("queue"));
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content:
            "HA! You're in! Now be ready to join your faction if you get picked. " +
            getRandomEmoji(),
          flags: 1 << 6,
        },
      });
    }
    if (name === "assign") {
      let currentFactions = appCache.get("factions");
      let queuedUsers = appCache.get("queuedUsers");
      // assign will assign a specific person to one faction
    }
    if (name === "assign_all") {
      //assign all uses to a random faction
      let currentFactions = appCache.get("factions");
      let queuedUsers = appCache.get("queue");
      let newFactions = assignAllUsers(queuedUsers, currentFactions);
      appCache.set("factions", newFactions);
      let factionTeamList = printTeams(newFactions);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `**${member.user.username} has assigned all queued users to factions: \n ${factionTeamList}`,
        },
      });
    }
    if (name == "unassign") {
    }
  }
  if (type === 3) {
    // listening for when an admin chooses the number of factions
    const { custom_id, values } = data;
    // creates factions and pushes them to dynamo DB, alerts channel that factions have been created.
    if (custom_id === "faction_select") {
      console.log(`selected ${values}`);
      let factions = createFactions(values);
      console.log(factions);
      let factionTeamList = printTeams(factions);
      appCache.set("factions", factions, 100000000);
      console.log(appCache.get("factions"));
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `**${member.user.username} has created a faction war, type /join to queue up for the war!**\n factions: \n ${factionTeamList}`,
        },
      });
    }
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");

  // DELETE SCRIPT
  // GetCommandsAttributes(process.env.APP_ID, process.env.GUILD_ID, "id").then(
  //   (res) => {
  //     DeleteGuildCommands(process.env.APP_ID, process.env.GUILD_ID, res)
  //   }
  // )
  // Check if guild commands from commands.json are installed (if not, install them)
  //   }
  // )
  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    FACTION_COMMAND,
    RESET_COMMAND,
    JOIN_COMMAND,
    ASSIGN_COMMAND,
    ASSIGN_ALL_COMMAND,
  ]);
});
