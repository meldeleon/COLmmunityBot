import "dotenv/config"
import fetch from "node-fetch"
import { verifyKey } from "discord-interactions"

export function verifydiscordRequest(clientKey) {
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

export async function discordRequest(endpoint, options) {
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
  let roles = member.roles
  if (roles) {
    if (member.roles.indexOf("965040006353805312") != -1) {
      console.log(`${member.user.username} is an admin`)
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export function logStatement(member, command) {
  console.log(`${member.user.username} ran ${command}`)
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

export const testQueue = [
  {
    user_id: "807313410009202788",
    user_name: "Ramirezd12",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "498945479397343253",
    user_name: "FadedKoalaZ",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "882498923476955147",
    user_name: "Prasler",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "698444987964194876",
    user_name: "semkki",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "877560701999276032",
    user_name: "KJRawks",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "303845825476558859",
    user_name: "dougtck",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "406592785982947330",
    user_name: "EVIL",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "721516076629885111",
    user_name: "TheChef",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "482648605195501578",
    user_name: "Ghost773",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "956704701112528927",
    user_name: "kippotoe",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "429132478268047376",
    user_name: "Muñe",
    queued: true,
    games_played: 0,
  },
  {
    user_id: "439987718060113941",
    user_name: "Profantasies",
    queued: true,
    games_played: 0,
  },
]
