export function assignAllUsers(userIds, factions) {
  //TODO: IF USER LIST IS LARGER THAN 57, RANDOMLY SELECT 57 OF THEM.

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
