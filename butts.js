const testUsersId = Array(23)
  .fill()
  .map(() => Math.round(Math.random() * 100000000).toString());

const factions = [
  {
    color: "blue",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    users: [],
  },
  {
    color: "green",
    discordChannel:
      "https://discord.com/channels/965039544183431188/965077230952804362",
    users: [],
  },
];

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

// console.log(testUsersId);
assignAllUsers(testUsersId, factions).forEach((faction) => {
  console.log(`faction ${faction.color} has ${faction.users.length} users`);
});
