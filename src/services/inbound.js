const PhoneNumber = require("../models/PhoneNumber")
const Redis = require("ioredis")
const ServerResponse = require("../utils/serverResponse")
const getPhoneNumber = require("./getPhoneNumber")

const redis = new Redis()

const inboundService = async (value) => {
    const number = await getPhoneNumber(value.to)
    if (number) {
        console.log({value})
        console.log("trim:", value.text.trim())
        if (value.text.trim() === "STOP") {
            // set it in redis and set expiry to 4hrs
            redis.set(`${value.from}-${value.to}`, value.to, 'ex', 14400)
        }
        const res = ServerResponse(200, "inbound sms ok", "")
        return res
    }
    else {
        const res = ServerResponse(400, "", "to parameter not found")
        return res
    }
}

module.exports = inboundService