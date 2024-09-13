function sendResponse(status, data) {
    return {
        StatusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        ...data
    };
}

function sendError(status, data) {
    return {
        StatusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        ...data
    };
}

module.exports = { sendResponse, sendError };