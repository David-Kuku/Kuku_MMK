const express = require('express');
const inboundController = require('../controllers/inbound');
const auth = require('./middleware/auth')
const router = express.Router()

router.post('/inbound/sms', auth, inboundController);

module.exports = router