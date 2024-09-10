const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');

exports.handler = async (event) => {
    try {
        const bookingId = event.pathParameters.id;

        // Hämta bokningen för att få roomId
        const bookingResult = await db.get({
            TableName: process.env.BOOKINGS_TABLE,
            Key: { id: bookingId }
        });

        const bookingItem = bookingResult.Item;

        if (!bookingItem) {
            return sendError(404, { message: 'Bokningen kunde inte hittas' });
        }

        const roomId = bookingItem.roomId;

        // Ta bort bokningen från bookings-tabellen
        await db.delete({
            TableName: process.env.BOOKINGS_TABLE,
            Key: { id: bookingId }
        });

        // Uppdatera huvudtabellen för att göra rummet tillgängligt igen
        await db.update({
            TableName: 'bonzai-db',  // Din huvudtabell
            Key: { id: roomId },
            UpdateExpression: 'set available = :available',
            ExpressionAttributeValues: {
                ':available': true
            }
        });

        return sendResponse(200, { success: true, message: 'Tråkigt att du väljer att avboka. Hoppas vi ses igen!' });
    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
