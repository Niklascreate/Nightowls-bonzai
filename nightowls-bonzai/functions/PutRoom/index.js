const { DynamoDB } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuid } = require('uuid');

const db = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { numberOfGuests, roomType, checkInDate, checkOutDate, guestName } = JSON.parse(event.body);

    // Kontrollera att alla fält är ifyllda
    if (!numberOfGuests || !roomType || !checkInDate || !checkOutDate || !guestName) {
        return sendError(400, { message: 'Alla fält måste vara ifyllda' });
    }

    // Kontrollera regler för 2 gäster
    if (numberOfGuests === 2 && roomType === 'singleroom') {
        return sendError(400, { message: 'För 2 gäster boka dubbelrum tack eller 2 enkelrum.' });
    }

    // Kontrollera regler för 3 gäster
    if (numberOfGuests === 3) {
        if (roomType === 'singleroom' || roomType === 'doubleroom') {
            return sendError(400, { message: 'För 3 gäster, boka 1 dubbelrum och 1 enkelrum eller boka en svit.' });
        } 
        if (roomType !== 'suite' && roomType !== 'combination') {
            return sendError(400, { message: 'För 3 gäster måste du välja antingen en suite eller en kombination av 1 dubbelrum och 1 enkelrum.' });
        }
    }

    // Beräkna pris
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

    try {
        await db.put({
            TableName: process.env.BOOKINGS_TABLE,
            Item: {
                available: true,
                id: uuid().substring(0, 5),
                roomId: roomId,
                roomType: roomType,
                price: pricePerRoom,
                numberOfGuests: numberOfGuests,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                guestName: guestName,
                totalPrice: totalPrice
            }
        });

        const bookingConfirmation = {
            bookingNumber: id,
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
