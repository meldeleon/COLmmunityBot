//AWS and Dynamo DB configs
import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export function pushViewerToDb()

export function pushUserToFactionDb(userId, factionColor) {
  const params = {
    TableName: "col_factions",
    Key: {
      color: factionColor,
    },
    UpdateExpression: "SET #u = list_append(#u, :newUser)",
    ExpressionAttributeNames: { "#u": "users" },
    ExpressionAttributeValues: {
      ":newUser": [userId],
    },
  };
  dynamodb.update(params, function (err, data) {
    if (err) console.log(err);
    else console.log(`Added ${userId} to ${factionColor}`);
  });
}

export function getFactionsFromDb() {
  const factionParams = {
    TableName: "col_factions",
    AttributesToGet: ["color", "discord", "index", "users"],
  };
  dynamodb.scan(factionParams, function (err, data) {
    if (err) {
      console.log("Failed to fetch factions", err);
    } else {
      let results = data.Items;
      console.log(`fetched factions: ${results}`);
      return results;
    }
  });
}

export function getQueuedUsers(numberOfUsers) {
  const params = {
    FilterExpression: "queued = :q",
    ExpressionAttributeValues: {
      ":q": true,
    },
    ProjectionExpression: "user_id",
    TableName: "col_viewers",
    Limit: numberOfUsers,
  };
  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log("Failed to fetch queued users", err);
    } else {
      let results = data.Items.map((user) => user.user_id);
      console.log(`fetched queued users: ${results}`);
    }
  });
}

export function resetAll(){
    const colors = ["blue", "green", "red", "yellow"];
    //delete all existing factions
    colors.forEach((team) => {
      let params = {
        TableName: "col_factions",
        Key: {
          color: team,
        },
      };
      dynamodb.delete(params, function (err, data) {
        if (err) {
          console.error(
            "unable to push factions to dynamo DB",
            err,
            err.stack
          );
        } else {
          console.log(`faction ${team} has been deleted from Dynamo DB`);
        }
      });
    });
}

export function join(member){
    let params = {
        TableName: "col_viewers",
        Item: {
          user_id: member.user.id,
          user_name: member.user.username,
          queued: true,
        },
      };
      dynamodb.put(params, function (err, data) {
        if (err) {
          console.error(
            `unable to add ${member.user.username} to dynamo DB 
            ${params.TableName}`,
            err,
            err.stack
          );
        } else {
          console.log(
            `${member.user.username} added to dynamo DB viewers table`
          );
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
      });
}

export function pushFactions(factions){
    factions.forEach((faction, index) => {
        let params = {
          TableName: "col_factions",
          Item: {
            color: faction.color,
            index: index,
            discord_channel: faction.discordChannel,
            users: faction.users,
          },
        };
        dynamodb.put(params, function (err, data) {
          if (err) {
            console.error(
              "unable to push factions to dynamo DB",
              err,
              err.stack
            );
          } else {
            console.log(`faction ${faction.color} added to dynamo DB`);
          }
        });
      });
}