const ServerResponse = (status, message, error) => {
    return {
        status,
        response: {
            message,
            error
        }
    }
}
module.exports = ServerResponse