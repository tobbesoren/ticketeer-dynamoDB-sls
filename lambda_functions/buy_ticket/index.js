/*This function returns uniqe ticket-id:s, info of
the event and decreases the ticket count for the
event. Checks ticket availability and updates db with
sold tickets id:s and buyers e-mail adress.
Endpoint: /events/{event-id}/buy
Method: PATCH

Needs to get:
{
    email: example@testing.com
    wantedTickets: [
        {ticketType1: 1},
        {ticketType2: 2},
       
    ]
}

checks if the tickets are available,
the registration deadLine isn't passed, then:

Creates a json:
{
    "buyerEmail": "buyer1@example.com",
    "ticketIDs": [
      {
        "id": "ticket1id",
        "checked": false
      },
      {
        "id": "ticket2id",
        "checked": true
      }
    ]
}

Updates the event's soldTickets with the json
Updates available tickets

And then returns the ticketID:s together with info about the event!

So, the error handling...


*/

const AWS = require("aws-sdk");
const { sendResponse } = require("../../functions/responses/sendResponse");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const showId = event.pathParameters.id;
  const body = JSON.parse.event.body;
  const email = body.email;
  const wantedTickets = body.wantedTickets;

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
      console.log(email, wantedTickets)
      return sendResponse(200, { success: true, order: body, event: show.Item });
      //check ticket availability
      //check registrationDeadLine
    } else {
      return sendResponse(404, { success: false, message: "Show not found" });
    }
  } catch (error) {
    console.error(error);
    return sendResponse(500, { success: false });
  }
};
