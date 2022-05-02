//third party lib dependencies
import "dotenv/config";

//globals to name the Teams, and set Discord Channes
const colors = ["blue", "green", "red", "yellow"];
const teamNames = ["Team Blue", "Team Green", " Team Red", "Team Yellow"];
const teamHeaders = [
  `:large_blue_diamond: ${teamNames[0]}: `,
  `:green_square: ${teamNames[1]}:`,
  `:heart: ${teamNames[2]}: `,
  `:yellow_circle: ${teamNames[3]}`,
];
const discordChannels = [
  "https://discord.com/channels/965039544183431188/965077230952804362",
  "https://discord.com/channels/965039544183431188/965078950449647686",
  "https://discord.com/channels/965039544183431188/965078506759389194",
  "https://discord.com/channels/965039544183431188/967949179328544819",
];

//creates initial factions objects in an array
export function createFactions(numberOfFactions) {
  let factions = [];
  for (let i = 0; i < numberOfFactions; i++) {
    let faction = {
      color: colors[i],
      discordChannel: discordChannels[i],
      //users: ["109422963136208896", "279052991976308738"],
      users: [],
    };
    factions.push(faction);
  }
  return factions;
}

//prints teams for discord responses
export function printTeams(factions) {
  let printStatement = ``;
  //console.log(`the length of factions are ${factions.length}`);
  let usersList = [];
  factions.forEach((faction) => {
    let factionTeamList = { name: faction.color, users: [] };
    faction.users.forEach((user) => {
      factionTeamList.users.push(`<@${user.user_id}>`);
    });
    usersList.push(factionTeamList);
  });
  //console.log(usersList);
  switch (factions.length) {
    case 2:
      printStatement = `${teamHeaders[0]} ${usersList[0].users} \n${teamHeaders[1]} ${usersList[1].users}`;
      break;
    case 3:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[0].users}\n${teamHeaders[2]} ${usersList[2].users}`;
      break;
    case 4:
      printStatement = `${teamHeaders[0]} ${usersList[0].users}\n${teamHeaders[1]} ${usersList[0].users}\n${teamHeaders[2]} ${usersList[2].users}\n${teamHeaders[3]} ${usersList[3].users}`;
      break;
    default:
      console.log(`cannot print factions`);
  }
  return printStatement;
}

//takes a list of users and the factions object, and returns a copy of the factions with users evenly assigned to the teams
export function assignAllUsers(userIds, factions) {
  let assignedFactions = factions.map((faction) => {
    return { ...faction };
  });
  switch (factions.length) {
    case 2:
      userIds.forEach((userId, index) => {
        if (index % 2 === 0) {
          assignedFactions[1].users.push(userId);
        } else {
          assignedFactions[0].users.push(userId);
        }
      });
      break;
    case 3:
      userIds.forEach((userId, index) => {
        if (index % 3 === 0) {
          assignedFactions[2].users.push(userId);
        } else if (index % 3 === 1) {
          assignedFactions[1].users.push(userId);
        } else {
          assignedFactions[0].users.push(userId);
        }
      });
      break;
    case 4:
      userIds.forEach((userId, index) => {
        if (index % 4 === 0) {
          assignedFactions[3].users.push(userId);
        } else if (index % 4 === 1) {
          assignedFactions[2].users.push(userId);
        } else if (index % 4 === 2) {
          assignedFactions[1].users.push(userId);
        } else {
          assignedFactions[0].users.push(userId);
        }
      });
      break;
  }
  return assignedFactions;
}

//mentions looks like <@user_id> like <@86890631690977280> more: https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
