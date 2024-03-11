// Send a success response
const sendSuccess = (res, message, result = null) => {
    res.status(200).json({
        success: true,
        message,
        result,
    });
};

// Send an error response
const sendError = (res, message, statusCode = 500, error = null) => {
    console.error('Error:', error);

    res.status(statusCode).json({
        success: false,
        message,
        error: error?.sqlMessage,
    });
};

module.exports = { sendSuccess, sendError };
