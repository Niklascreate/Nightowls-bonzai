const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');

exports.handler = async (event) => {
    try {
        const roomId = event.pathParameters.id;

        await db.delete({
            TableName: process.env.BOOKINGS_TABLE,
            Key: {
                id: roomId
            }
        });

        return sendResponse(200, { success: true, message: 'Tråkigt att du väljer att avboka. Hoppas vi ses igen!' });
    } catch (error) {
        return sendError(500, { message: error.message });
    }
};