import { assignAllUsers, selectUsersFromQueue } from "./faction.js";

const testUsersId = Array(80)
  .fill()
  .map(() => Math.round(Math.random() * 10000000).toString());

const testQueue = testUsersId.map((x, index) => {
  if (index % 2 === 0) {
    return {
      user_id: x,
      user_name: `testName${x}`,
      queued: true,
      gamesPlayed: 1,
    };
  } else {
    return {
      user_id: x,
      user_name: `testName${x}`,
      queued: true,
      gamesPlayed: 0,
    };
  }
});
console.table(testQueue);

export function flipQueue(queue, factions) {
  const assignedUsers = [];
  factions.forEach((faction) => {
    faction.users.forEach((userId) => {
      assignedUsers.push(userId);
    });
  });
  const newQueue = queue.map((user) => {
    return { ...user };
  });
  queue.forEach((user, index) => {
    newQueue[index].queued = false;
    if (assignedUsers.indexOf(user.user_id) >= 0) {
      newQueue[index].gamesPlayed++;
    }
  });
  return newQueue;
}

let selectedUsers = selectUsersFromQueue(testQueue);
console.log(selectedUsers);
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

let filledFactions = assignAllUsers(selectedUsers, factions);

let test = flipQueue(testQueue, filledFactions);

console.table(test);
