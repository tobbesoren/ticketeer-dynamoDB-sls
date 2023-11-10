const AWS = require("aws-sdk");
const { sendResponse } = require("../../functions/responses/sendResponse");
const db = new AWS.DynamoDB.DocumentClient();

async function getTicket(ticketId) {
    const ticket = await db.get({
        //TableName: Whatever
        key: {
            id: ticketId
        }
    })
}

async function verifyTicket(ticketId) {
    // PATCH set ticket.verified = true OM den inte redan är det!
}

exports.handler = async (event, context) => {
    const {ticketId} = event.pathParameters;

    const ticket = getTicket(ticketId);
    if(!ticket) {
        return sendResponse(404, {success: false, message: "Ticket not found"})
    }

    await verifyTicket(ticketId);
    
}