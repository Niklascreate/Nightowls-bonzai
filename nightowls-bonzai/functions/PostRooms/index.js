const { db } = require('../../services/index');
const { sendResponse, sendError } = require('../../responses/index');
const { v4: uuid } = require('uuid');

exports.handler = async (event) => {
    const rooms = JSON.parse(event.body);
    
    try {
        for (const room of rooms) {
            const id = uuid().substring(0, 5);
            
            await db.put({
                TableName: 'bonzai-db',
                Item: {
                    available: true,
                    id: id,
                    roomType: room.roomType,
                    price: room.price
                }
            });
        }

        return sendResponse(200, { success: true });
    } catch (error) {
        return sendError(500, { message: error.message });
    }
};