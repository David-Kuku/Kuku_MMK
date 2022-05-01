const reqSchema = require("../schema/validator");
const outboundService = require("../services/outbound");
const errorCatch = require("../utils/errorCatch");

const outboundController = async (req, res) => {
    try {
        const value = await reqSchema.validateAsync(req.body);
        const result = await outboundService(value);

        res.status(result.status).send(result.response)

    }
    catch (err) {
        const result = errorCatch(err)
        res.status(result.status).send(result.response)

    }

}

module.exports = outboundController