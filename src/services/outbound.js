const { default: Redis } = require("ioredis");
const ServerResponse = require("../utils/serverResponse");
const getPhoneNumber = require("./getPhoneNumber");

const redis = new Redis();
const outboundService = async (value) => {
 
    const search_result = await getPhoneNumber(value.from)
    if (search_result) {
        const result = await redis.get(`${value.from}-${value.to}`)

        // if result from redis exists, then a STOP request must have been sent
        if (result === value.to) {
            const res = ServerResponse(400, "", `sms from ${value.from} to ${value.to} blocked by STOP request`)
            return res
        }

        // else if result does not exist,it means a stop request has not been sent
        else {
            const reqCount = await redis.get(value.from)
            let requestCount = parseInt(reqCount)
            
            console.log(requestCount)
            if (requestCount > 50) {
                // set limit to 50 (if no of count reaches 50, the limit error should be thrown)
                const res = ServerResponse(400, "", `limit reached for from ${value.from}`)
                return res
            }
            // else if the requestCount was nil, increase the redis value and set it to expire in 24hrs
            else if (!requestCount) {
                await redis.incr(value.from)
                await redis.expire(value.from, 86400)

                const res = ServerResponse(200, "outbound sms ok", "")
                return res
            }
            // else just increase the redis value
            else {
                await redis.incr(value.from)
                const res = ServerResponse(200, "outbound sms ok", "")
                return res
            }         
        }
    }
    else {
        const res = ServerResponse(400, "", "from parameter not found")
        return res
    }
}

module.exports = outboundService;

