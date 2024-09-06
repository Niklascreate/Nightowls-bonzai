function sendResponse(status, data) {
    return {
        StatusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({data})
    };
}

function sendError(status, data) {
    return {
        StatusCode: status,
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({success : false, data})
    };
}

module.exports = { sendResponse, sendError };