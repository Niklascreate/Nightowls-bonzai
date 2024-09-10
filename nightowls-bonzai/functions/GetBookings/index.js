const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
    try {
        // Hämta alla bokningar från DynamoDB
        const result = await db.scan({
            TableName: process.env.BOOKINGS_TABLE
        });

        const bookings = result.Items;

        
        if (!bookings || bookings.length === 0) {
            return sendError(404, { message: 'Inga bokningar hittades.' });
        }

        
        const bookingsOverview = bookings.map(booking => ({
            bookingNumber: booking.id,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            numberOfGuests: booking.numberOfGuests,
            roomType: booking.roomType,
            guestName: booking.guestName
        }));

       
        return sendResponse(200, bookingsOverview);

    } catch (error) {
        return sendError(500, { message: error.message });
    }
};
