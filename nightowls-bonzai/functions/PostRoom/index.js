const { DynamoDB } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuid } = require('uuid');

const db = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { numberOfGuests, roomType, checkInDate, checkOutDate, guestName } = JSON.parse(event.body);

    
    if (!numberOfGuests || !roomType || !checkInDate || !checkOutDate || !guestName) {
        return sendError(400, { message: 'Alla fält måste vara ifyllda' });
    }

    
    if (numberOfGuests === 2 && roomType === 'singleroom') {
        return sendError(400, { message: 'Boka dubbelrum tack.' });
    }

    if (numberOfGuests === 3) {
        if (roomType === 'singleroom') {
            return sendError(400, { message: 'För 3 gäster, boka 1 dubbelrum och 1 enkelrum tack.' });
        } else if (roomType === 'doubleroom') {
            return sendError(400, { message: 'För 3 gäster, boka 1 dubbelrum och 1 enkelrum tack.' });
        }
    }

    
    if (numberOfGuests === 3 && roomType !== 'suite' && roomType !== 'combination') {
        return sendError(400, { message: 'För 3 gäster måste du välja antingen en suite eller en kombination av 1 dubbelrum och 1 enkelrum.' });
    }

    const id = uuid().substring(0, 5);
    const pricePerRoom = roomType === 'singleroom' ? 500 : (roomType === 'doubleroom' ? 1000 : (roomType === 'suite' ? 1500 : 0));
    const totalPrice = pricePerRoom * numberOfGuests;

    try {
        await db.put({
            TableName: process.env.BOOKINGS_TABLE,
            Item: {
                available: true,
                id: id,
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
            guestName: guestName
        };

        return sendResponse(200, bookingConfirmation);
    } catch (error) {
        return sendError(500, { message: error.message });
    }
};