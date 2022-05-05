const reqSchema = require("../schema/validator");
const inboundService = require("../services/inbound");
const errorCatch = require("../utils/errorCatch");

const inboundController = async (req, res) => {
    
    try {
        const value = await reqSchema.validateAsync(req.body);
        const result =  await inboundService(value);
        
        res.status(result.status).send(result.response)
    }
    catch (err) {
        console.log({err})
        const result = errorCatch(err)
        res.status(result.status).send(result.response)

    }

}

module.exports = inboundController