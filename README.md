TICKETEER - An API for a mock event and ticket selling service.

Endpoints:
postEvent:
  path: '/events'
  method: POST
  Add JSON following this template:

  {
			"contactEmail": "tickets@example.com",
			"eventName": "Bauhaus Gothic Revival Night",
			"soldTickets": [],
			"eventDate": "2023-12-10",
			"eventDescription": "Experience the revival of gothic with Bauhaus in a mesmerizing live show.",
			"eventLocation": "John Dee, Oslo, Norway",
			"eventCategories": [
				"Music",
				"Gothic Revival"
			],
			"organizer": "Gothic Revival Events Norway",
			"eventTime": "20:00",
			"eventImageURL": "https://example.com/bauhaus-concert.jpg",
			"eventTags": [
				"Gothic Revival",
				"Live Music"
			],
			"contactPhone": "+123-456-7890",
			"registrationDeadline": "2023-11-30T23:59:59",
			"ticketTiers": [
				{
					"totalTickets": 200,
					"ticketsLeft": 200,
					"ticketPrice": 35,
					"tierName": "General Admission"
				},
				{
					"totalTickets": 100,
					"ticketsLeft": 100,
					"ticketPrice": 60,
					"tierName": "VIP"
				}
			],
			"id": "79900d96-6eef-4072-8478-d637c8d33d2c",
			"eventCapacity": 300
		}

getEvents:
  path: '/events'
  method: GET

getEvent:
  path: '/events/{id}'
  method: GET

orderTicket:
  path: '/order/{id}'
  method: PATCH
  Add JSON:
  