# Nightowls-bonzai
Utveckling och Driftsättning i Molnmiljö


## Endpoints:


### POST
Posta alla rum till databasen.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/rooms

Skicka med detta i bodyn/json.
```
[
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    { "roomType": "singleroom", "price": 500 },
    
    { "roomType": "doubleroom", "price": 1000 },
    { "roomType": "doubleroom", "price": 1000 },
    { "roomType": "doubleroom", "price": 1000 },
    { "roomType": "doubleroom", "price": 1000 },
    { "roomType": "doubleroom", "price": 1000 },

    { "roomType": "suiteroom", "price": 1500 },
    { "roomType": "suiteroom", "price": 1500 },
    { "roomType": "suiteroom", "price": 1500 },
    { "roomType": "suiteroom", "price": 1500 },
    { "roomType": "suiteroom", "price": 1500 }
]
```

### GET
Hämta alla rum från DynamoDB för en överblick med viktig information som till exempel roomID.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/rooms

### POST
Boka ett rum.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/room  // Ta Id:et från Get anropet när du hämtar alla rum från databasen och lägg det i bodyn ynder "roomId": "här" .
```
[
		{
		"numberOfGuests": 1,
		"roomType": "singleroom",
		"checkInDate": "2024-09-10",
		"checkOutDate": "2024-09-11",
		"guestName": "Gris Nils",
		"email": "GrisNils@ladan.se",
		"roomId": "819b5"
		}
]
```

### GET Bookings
Hämta alla bokningar som är gjorda från bookings-databasen(DynamoDB)
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/bookings


### PUT
För att ändra en bokning. Kör ett Get anrop mot bookings för att få fram ditt bookingNumber och använd det för att ändra bokning.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/updateRoom/{id}

```
{
  "numberOfGuests": 1,
  "roomType": "singleroom",
  "checkInDate": "2024-09-10",
  "checkOutDate": "2024-09-11",
  "guestName": "Niklas Nilsson",
  "email": "NiklasNilsson@gmail.com"
}

```


### DELETE
För att ta bort en bokning: Kör ett Get anrop mot bookings för att få fram ditt bookingNumber och använd det för att avboka.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/room/{id}
