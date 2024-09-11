const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuid } = require('uuid');

exports.handler = async (event) => {
    try {
        const bookings = JSON.parse(event.body);

        if (!Array.isArray(bookings) || bookings.length === 0) {
            return sendError(400, { message: 'Minst en bokning krävs.' });
        }

        const bookingConfirmations = [];

        for (const booking of bookings) {
            const { numberOfGuests, roomType, checkInDate, checkOutDate, guestName, email } = booking;

            if (!numberOfGuests || !roomType || !checkInDate || !checkOutDate || !guestName || !email) {
                return sendError(400, { message: 'Alla fält måste vara ifyllda för varje bokning.' });
            }

            const roomId = booking.roomId || event.pathParameters.id;

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

            const totalPrice = pricePerRoom;
            const bookingId = uuid().substring(0, 5);

            // Spara bokningen
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
                    available: true,
                    email: email
                }
            });

            // Uppdatera tillgängligheten för rummet
            await db.update({
                TableName: 'bonzai-db',
                Key: { id: roomId },
                UpdateExpression: 'set available = :available',
                ExpressionAttributeValues: {
                    ':available': false
                }
            });

            // Skapa bokningsbekräftelse
            const bookingConfirmation = {
                bookingNumber: bookingId,
                numberOfGuests: numberOfGuests,
                roomType: roomType,
                totalPrice: totalPrice,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                guestName: guestName,
                email: email,
                roomId: roomId
            };

            bookingConfirmations.push(bookingConfirmation);
        }

        return sendResponse(200, { bookings: bookingConfirmations });

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
