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
const uuid = require("uuid");

async function testAddTicket(showId) {
  //This function works as intended!
  //Now I just need to get all the checks in place...
  const ticketId = uuid.v4();
  const newTicket = {
    id: `${ticketId}`,
    checked: false,
  };
  try {
    await db
      .update({
        TableName: "events-db",
        Key: {
          id: showId,
        },
        UpdateExpression:
          "set soldTickets = list_append(if_not_exists(soldTickets, :empty_list), :newTicket)",
        ExpressionAttributeValues: {
          ":newTicket": [newTicket],
          ":empty_list": [],
        },
      })
      .promise();
    return { success: true, ticket: newTicket };
  } catch (error) {
    return { success: false, error: error };
  }
}

exports.handler = async (event, context) => {
  const showId = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const email = body.email;
  const wantedTickets = body.wantedTickets;
  console.log(email, wantedTickets);

  //   const response = await testAddTicket(showId);
  //   return sendResponse(response.success ? 200: 400, response);
  // };

  try {
    const data = await db
      .get({
        TableName: "events-db",
        Key: {
          id: showId,
        },
      })
      .promise();

    const show = data.Item;
    const showStatus = checkShowStatus(show);

    if (!showStatus.success === true) {
      return sendResponse(404, showStatus);
    }

    const ticketsAvailable = checkTicketAvailability(show, wantedTickets);

    if (!ticketsAvailable) {
      return sendResponse(400, {
        success: false,
        message: "One or more of your selected tickets are not available",
      });
    }

    const ticketReciept = placeOrder(wantedTickets, showId);

    return sendResponse(200, {
      success: true,
      message: "Your tickets are available",
    });
  } catch (error) {
    console.error(error);
    return sendResponse(500, {
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

async function placeOrder(wantedTickets, showId) {
  //const tickets = createTickets(wantedTickets, showId);
  //const ticketReciept = tickets.reciept;
  //const ticketArray = tickets.sold

}

function createTickets(wantedTickets, showId) {
  let tickets = {}
}

function createTicket(showId, ticketTier, mailAdress) {

}

/*
Returns true if all wanted tiers:
1. Exists,
2. Have tickets enough for the order,
3. No negative quantity is entered,
4. Type of wanted quantity is an Int
*/
function checkTicketAvailability(show, wantedTickets) {
  const ticketTiers = show.ticketTiers;

  const areAllTiersAvailable = wantedTickets.every((ticketTier) => {
    const wantedTierName = Object.keys(ticketTier)[0];
    const availableTier = ticketTiers.find(
      (tier) => tier.tierName === wantedTierName
    );

    return (
      availableTier &&
      availableTier.ticketsLeft >= ticketTier[wantedTierName] &&
      ticketTier[wantedTierName] > 0 &&
      Number.isInteger(ticketTier[wantedTierName])
    );
  });

  return areAllTiersAvailable;
}

function checkShowStatus(show) {
  let response = {};
  if (!show) {
    response = {
      success: false,
      message: "No such event",
    };
    return response;
  }

  const eventStatus = show.eventStatus;
  console.log(eventStatus);
  response = { eventStatus: eventStatus };

  switch (eventStatus) {
    case "AVAILABLE":
      response = {
        success: true,
        message: "Event tickets on sale",
      };
      break;
    case "SOLD_OUT":
      response = {
        success: false,
        message: "Event sold out",
      };
      break;
    case "CANCELED":
      response = {
        success: false,
        message: "Event canceled",
      };
      break;
    case "ON_HOLD":
      response = {
        success: false,
        message: "Event on hold",
      };
      break;
    case "SALES_CLOSED":
      response = {
        success: false,
        message: "Sales closed",
      };
      break;
    case "PAST_EVENT":
      response = {
        success: false,
        message: "The event has already taken place",
      };
      break;
    default:
      response = {
        success: false,
        message: "Invalid event status",
      };
  }
  return response;
}

function orderTickets(wantedTickets, showId) {}
