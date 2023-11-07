//this function returns the event corresponding to the uniq ID.
//Endpoint: /events/{event-id}
//Method: GET

const AWS = require("aws-sdk");
const { sendResponse } = require("../../functions/responses/sendResponse");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const showId = event.pathParameters.id;
  console.log(showId);

  try {
    const show = await db
      .get({
        TableName: "events-db",
        Key: {
          id: showId,
        },
      })
      .promise();

    if (show.Item) {
      return sendResponse(200, { success: true, event: show.Item });
    } else {
      return sendResponse(404, { success: false, message: "Show not found" });
    }
  } catch (error) {
    console.error(error);
    return sendResponse(500, { success: false});
  }
};