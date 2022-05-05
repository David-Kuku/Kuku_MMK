const Account = require('../../models/Account')

const auth = async (req, res, next) => {
    try {
        console.log(req.headers.authorization)
        const base64cred = req.headers.authorization.split(' ')[1]
        console.log({base64cred})
        const cred = Buffer.from(base64cred, 'base64').toString('ascii')
        const [username, password] = cred.split(':')
        console.log({username})
        console.log({password})
        const user = await Account.findOne({ where: { username: username } })
        
        if (user.auth_id != password) {
            return res.status(403).send({
                message: "Invalid Authorization"
            })
        }
        req.user = user
        next()
    }
    catch (e) {
        return res.status(403).send({
            message: "Invalid Authorization"
        })
    }

}

module.exports = auth