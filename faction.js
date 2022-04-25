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

//example data block

let testInteraction = {
  type: 2,
  token: "A_UNIQUE_TOKEN",
  member: {
    user: {
      id: "53908232506183680",
      username: "Mason",
      avatar: "a_d5efa99b3eeaa7dd43acca82f5692432",
      discriminator: "1337",
      public_flags: 131141,
    },
    roles: ["539082325061836999"],
    premium_since: null,
    permissions: "2147483647",
    pending: false,
    nick: null,
    mute: false,
    joined_at: "2017-03-13T19:19:14.040000+00:00",
    is_pending: false,
    deaf: false,
  },
  id: "786008729715212338",
  guild_id: "290926798626357999",
  guild_locale: "en-US",
  locale: "en-US",
  data: {
    options: [
      {
        name: "number",
        value: "1",
      },
    ],
    name: "faction",
    id: "771825006014889984",
  },
  channel_id: "645027906669510667",
}

function createFaction(no, factionName) {
  const faction = {
    name: factionName,
    number: no,
    players: [],
  }
}

export function assignFaction(name, id) {
  let testFactionResponse = {
    number: 1,
    name: "soonersons",
    color: "blue",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    userName: name,
    userID: id,
  }
  return testFaction
}

/*
{
   number: 1,
   name : "faction_name",
   players : [
       {

       },
       {

       },
   ]

}
*/

//mentions looks like <@user_id> like <@86890631690977280> more: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
