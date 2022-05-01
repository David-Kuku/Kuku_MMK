const express = require('express')
const cors = require('cors')

const inboundRouter = require('./routes/inbound')
const outboundRouter = require('./routes/outbound')

const app = express()
const port = process.env.PORT

app.use(express.json())

// app.use(cors({
//     methods: 'POST',
//     preflightContinue: true,
//     origin: '*',
// }));

app.use(inboundRouter)
app.use(outboundRouter)

app.all('/*', (req, res) => {
    res.status(405).send()
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
    console.log('Database connected')
})