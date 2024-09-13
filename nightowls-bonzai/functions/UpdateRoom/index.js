const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');

exports.handler = async (event) => {
    try {
        const { numberOfGuests, roomType, checkInDate, checkOutDate, guestName, email } = JSON.parse(event.body);

        if (!numberOfGuests || !roomType || !checkInDate || !checkOutDate || !guestName) {
            return sendError(400, { message: 'Alla fält måste vara ifyllda' });
        }

        const bookingId = event.pathParameters.id;

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

        await db.update({
            TableName: process.env.BOOKINGS_TABLE,
            Key: { id: bookingId },
            UpdateExpression: 'set roomType = :roomType, price = :price, numberOfGuests = :numberOfGuests, checkInDate = :checkInDate, checkOutDate = :checkOutDate, guestName = :guestName, totalPrice = :totalPrice, email = :email',
            ExpressionAttributeValues: {
                ':roomType': roomType,
                ':price': pricePerRoom,
                ':numberOfGuests': numberOfGuests,
                ':checkInDate': checkInDate,
                ':checkOutDate': checkOutDate,
                ':guestName': guestName,
                ':totalPrice': totalPrice,
                ':email': email
            }
        });

        const updateConfirmation = {
            bookingNumber: bookingId,
            numberOfGuests: numberOfGuests,
            roomType: roomType,
            totalPrice: totalPrice,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            guestName: guestName,
            email: email
        };

        return sendResponse(200, updateConfirmation);

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};