const PhoneNumber = require("../models/PhoneNumber");

const getPhoneNumber = async (value) => {
    const number = await PhoneNumber.findOne({
        where: { number: value }
    })

    return number
}

module.exports = getPhoneNumber