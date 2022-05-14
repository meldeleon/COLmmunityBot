import "dotenv/config"
import fetch from "node-fetch"
import { verifyKey } from "discord-interactions"

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519")
    const timestamp = req.get("X-Signature-Timestamp")

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
    if (!isValidRequest) {
      res.status(401).send("Bad request signature")
      throw new Error("Bad request signature")
    }
  }
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v9/" + endpoint
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body)
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  })
  // throw API errors
  if (!res.ok) {
    const data = await res.json()
    console.log(res.status)
    throw new Error(JSON.stringify(data))
  }
  // return original response
  return res
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = [
    "😭",
    "😄",
    "😌",
    "🤓",
    "😎",
    "😤",
    "🤖",
    "😶‍🌫️",
    "🌏",
    "📸",
    "💿",
    "👋",
    "🌊",
    "✨",
  ]
  return emojiList[Math.floor(Math.random() * emojiList.length)]
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function memberAdmin(member) {
  if (member.roles.indexOf("965040006353805312") != -1) {
    console.log(`${member.user.username} is an admin`)
    return true
  } else {
    return false
  }
}

export function notAdminMsg(res, InteractionResponseType) {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      // Fetches a random emoji to send from a helper function
      content: "You must be an admin to run that command",
      flags: 1 << 6, //ephemeral msg flag
    },
  })
}
