const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');

// Skapa en instans av DynamoDBClient
const dynamoClient = new DynamoDBClient();
const db = DynamoDBDocument.from(dynamoClient);  

exports.handler = async (event) => {
    try {
        const bookingId = event.pathParameters.id;  

        if (!bookingId) {
            return sendError(400, { message: 'Bokningsnummer är obligatoriskt.' });
        }

        // Hämta bokningen från DynamoDB
        const result = await db.get({
            TableName: process.env.BOOKINGS_TABLE, 
            Key: {
                id: bookingId
            }
        });

        const booking = result.Item;

       
        if (!booking) {
            return sendError(404, { message: 'Bokning hittades inte.' });
        }

       
        const bookingDetails = {
            bookingNumber: booking.id,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            numberOfGuests: booking.numberOfGuests,
            roomType: booking.roomType,
            guestName: booking.guestName
        };

        return sendResponse(200, bookingDetails);

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
