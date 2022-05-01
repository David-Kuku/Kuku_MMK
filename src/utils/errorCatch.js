const ServerResponse = require("./serverResponse")

const errorCatch = (val) => {
    const status = 400
    if (val.details[0].type == 'string.empty') {
        const res = ServerResponse(status, "", val.details[0].path[0] + ' is missing')
        return res
        
    }
    else if (['string.min', 'string.max'].includes(val.details[0].type)) {
        const res = ServerResponse(status, "", val.details[0].path[0] + ' is invalid')
        return res
        
    } else {
        const res = ServerResponse(status, "", "unknown failure")
        return res
        
    }
}

module.exports = errorCatch