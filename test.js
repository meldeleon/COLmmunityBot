const colors = ["blue", "green", "red", "yellow"]
//delete all existing factions
colors.forEach((team) => {
  let params = {
    TableName: "col_factions",
    Key: {
      color: team,
    },
  }
  dynamodb.delete(params, function (err, data) {
    if (err) {
      console.error("unable to push factions to dynamo DB", err, err.stack)
    } else {
      console.log(`faction has been deleted from Dynamo DB`)
    }
  })
})
