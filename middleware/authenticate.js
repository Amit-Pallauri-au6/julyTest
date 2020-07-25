const { verify } = require('jsonwebtoken')
const { privatekey } = process.env
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if(!token){ return res.status(400).json({
            "message" : "invalid token"
        })}else{
            const verifiedToken = await verify(token, privatekey)
            if(!verifiedToken) return res.status(400).json({
                "message" : "you need to sign in"
            })
            next()
        }
        

    } catch (error) {
        console.log(error)
    }
}