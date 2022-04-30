//AWS and Dynamo DB configs
import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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
