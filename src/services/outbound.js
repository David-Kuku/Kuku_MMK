const { default: Redis } = require("ioredis");
const PhoneNumber = require("../models/PhoneNumber");
const ServerResponse = require("../utils/serverResponse");

const redis = new Redis();
const outboundService = async (value) => {
    // make a check if phone number exists
    const search_result = await PhoneNumber.findOne({
        where: { number: value.from }
    })

    if (search_result) {
        const result = await redis.get(`${value.from}-${value.to}`)

        // if result from redis is the "to" value, then a STOP request must have been sent
        if (result === value.to) {
            const res = ServerResponse(400, "", `sms from ${value.from} to ${value.to} blocked by STOP request`)
            return res
        }

        // else if result was not equal to the "to" value,it means a stop request has not been sent, 
        // then the result from redis will be the request count 
        // which will initially be null (0)
        else if (result != value.to) {
            // if result was initially 0
            if (result == null) {
                // increase the value to 1 and then set it to expire in 24hrs ()
                await redis.incr(value.from)
                await redis.expire(value.from, 86400)

                const res = ServerResponse(200, "outbound sms ok", "")
                return res
            }

            // if result was greater than 0
            else {
                // set limit to 50 (if no of count reaches 50, the limit error should be thrown)
                if (Number(result) === 50) {
                    const res = ServerResponse(400, "", `limit reached for from ${value.from}`)
                    return res
                }
                // else just increament the redis value
                else {
                    await redis.incr(value.from)
                    const res = ServerResponse(200, "outbound sms ok", "")
                    return res
                }
            }
        }

    }
    else {
        const res = ServerResponse(400, "", "from parameter not found")
        return res
    }
}

module.exports = outboundService;

