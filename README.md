# Nightowls-bonzai
Utveckling och Driftsättning i Molnmiljö


## Endpoints:


1 ### POST
Posta alla rum till databasen.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/rooms

2 ### GET
Hämta alla rum från DynamoDB för en överblick med viktig information som till exempel roomID.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/rooms

### POST
Boka ett rum.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/room/{id}  // Ta id:et från Get anropet när du hämtar alla rum från databasen.

### GET Bookings
Hämta alla bokningar som är gjorda från bookings-databasen(DynamoDB)
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/bookings

### PUT
För att ändra en bokning.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/updateRoom/{id}

### DELETE
För att ta bort en bokning: Kör ett Get anrop mot bookings för att få fram ditt bookingNumber och använd det för att avboka.
https://fji9l910ii.execute-api.eu-north-1.amazonaws.com/api/room/{id}

### POST
