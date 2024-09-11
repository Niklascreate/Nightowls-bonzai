# Nightowls-bonzai
Utveckling och Driftsättning i Molnmiljö


## Endpoints:


1 ### POST
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

2 ### GET
Hämta alla rum från DynamoDB för en överblick med viktig information som till exempel roomID.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/rooms

### POST
Boka ett rum.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/room/{id}  // Ta id:et från Get anropet när du hämtar alla rum från databasen.
```
{
  "numberOfGuests": 1,
  "roomType": "singleroom", // Rumrstyper = singleroom, doubleroom, suite 
  "checkInDate": "2024-12-24",
  "checkOutDate": "2024-12-25",
  "guestName": "Gris Nils",
	"email": "GrisNils@ladan.se"
}
```

### GET Bookings
Hämta alla bokningar som är gjorda från bookings-databasen(DynamoDB)
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/bookings

### PUT
För att ändra en bokning.
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
