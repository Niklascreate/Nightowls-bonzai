const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');
const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuid } = require('uuid');

// Skapa en instans av DynamoDBClient
const dynamoClient = new DynamoDBClient();
const db = DynamoDBDocument.from(dynamoClient);  // Korrekt användning av DynamoDBDocument från lib-dynamodb

exports.handler = async (event) => {
    try {
        const { numberOfGuests, roomType, checkInDate, checkOutDate, guestName } = JSON.parse(event.body);

        if (!numberOfGuests || !roomType || !checkInDate || !checkOutDate || !guestName) {
            return sendError(400, { message: 'Alla fält måste vara ifyllda' });
        }

        const roomId = event.pathParameters.id;

        if (numberOfGuests === 2 && roomType === 'singleroom') {
            return sendError(400, { message: 'För 2 gäster boka dubbelrum tack eller 2 enkelrum.' });
        }

        if (numberOfGuests === 3) {
            if (roomType === 'singleroom' || roomType === 'doubleroom') {
                return sendError(400, { message: 'För 3 gäster, boka 1 dubbelrum och 1 enkelrum eller boka en svit.' });
            } 
            if (roomType !== 'suite' && roomType !== 'combination') {
                return sendError(400, { message: 'För 3 gäster måste du välja antingen en suite eller en kombination av 1 dubbelrum och 1 enkelrum.' });
            }
        }

        let pricePerRoom;
        if (roomType === 'singleroom') {
            pricePerRoom = 500;
        } else if (roomType === 'doubleroom') {
            pricePerRoom = 1000;
        } else if (roomType === 'suite') {
            pricePerRoom = 1500;
        } else {
            return sendError(400, { message: 'Ogiltig rumtyp.' });
        }

        const totalPrice = pricePerRoom * numberOfGuests;
        const bookingId = uuid().substring(0, 5);

        await db.put({
            TableName: process.env.BOOKINGS_TABLE,
            Item: {
                id: bookingId,
                roomId: roomId,
                roomType: roomType,
                price: pricePerRoom,
                numberOfGuests: numberOfGuests,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                guestName: guestName,
                totalPrice: totalPrice,
                available: true
            }
        });

        await db.update({
            TableName: 'bonzai-db',
            Key: { id: roomId },
            UpdateExpression: 'set available = :available',
            ExpressionAttributeValues: {
                ':available': false
            }
        });

        //bokningsbekräftelse
        const bookingConfirmation = {
            bookingNumber: bookingId,
            numberOfGuests: numberOfGuests,
            roomType: roomType,
            totalPrice: totalPrice,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            guestName: guestName,
            roomId: roomId
        };

        return sendResponse(200, bookingConfirmation);

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
