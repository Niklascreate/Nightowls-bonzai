const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');

exports.handler = async (event) => {
    try {
        const result = await db.scan({
            TableName: 'bonzai-db',
        });

        const Items = result.Items;

        if (Items && Items.length > 0) {
            const formattedRooms = Items.map(room => ({
                Available: room.available,
                id: room.id,
                price: room.price,
                roomType: room.roomType
            }));

            return sendResponse(200, formattedRooms);
        } else {
            return sendError(404, { success: false, message: 'Inga rum hittades!' });
        }

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
