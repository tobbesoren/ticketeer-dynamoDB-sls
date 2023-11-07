const AWS = require("aws-sdk");
const uuid = require("uuid");
const { sendResponse } = require("../../functions/responses/sendResponse");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const show = JSON.parse(event.body);
  // I should check the event so all necessary properties are there!
  const showID = uuid.v4();

  show.id = showID;
  console.log(show);

  try {
    await db
      .put({
        TableName: "events-db",
        Item: show,
      })
      .promise();
    return sendResponse(200, { success: true });
  } catch (error) {
    return sendResponse(500, { success: false });
  }
};
