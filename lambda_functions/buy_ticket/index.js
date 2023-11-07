/*This function returns a uniqe ticket-id, info of
the event and decreases the ticket count for the
event. Checks ticket availability and updates db with
sold tickets id:s and buyers e-mail adress.
Endpoint: /events/{event-id}/buy
Method: PATCH */