//This function returns all the events.
//Endpoint: /events
//Method: GET

const AWS = require("aws-sdk");
const { sendResponse } = require("../../functions/responses/sendResponse");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const { Items } = await db
      .scan({
        TableName: "events-db",
      })
      .promise();
    return sendResponse(200, { success: true, events: Items });
  } catch (error) {
    return sendResponse(500, { success: false });
  }
};
