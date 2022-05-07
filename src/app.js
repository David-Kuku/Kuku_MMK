const express = require('express')
const cors = require('cors')

const inboundRouter = require('./routes/inbound')
const outboundRouter = require('./routes/outbound')

const app = express()

app.use(express.json())

app.use(cors({
    methods: 'POST',
    preflightContinue: true,
    origin: '*',
}));

app.use(inboundRouter)
app.use(outboundRouter)

app.all('/*', (req, res) => {
    res.status(405).send({"status": "Active"})
})

module.exports = app
