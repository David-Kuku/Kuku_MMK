const Joi = require('joi')

const reqSchema = Joi.object({
    from: Joi.string().pattern(/^[0-9]+$/, 'numbers').min(6).max(16).required(),
    to: Joi.string().pattern(/^[0-9]+$/, 'numbers').min(6).max(16).required(),
    text: Joi.string().min(1).max(120).required()
})

module.exports = reqSchema