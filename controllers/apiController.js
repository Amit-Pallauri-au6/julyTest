const User = require('../models/users')
const { sign, verify } = require('jsonwebtoken')
const { privatekey } = process.env
// const cloudinary = require('../fileUpload/cloudinary/cloudinary')
// const bufferToString = require('../fileUpload/bufferToString/bufferToString')
// const Image = require('../models/images')

module.exports = {

    async userSignUp(req, res){
        try {
            const newUser = await User.create({...req.body})
            const token = await sign({ newUser }, privatekey, { expiresIn : 60*60*10 })
            newUser.token = token
            await newUser.save()
            res.json({
                "message" : "successfully registered",
                "user" : newUser
            })
        } catch (error) {
            console.log(error)
        }
    },

    async userSignIn(req, res){
        try {
            const {email, password} = req.body
            const foundUser = await User.findByEmailAndPassword(email, password)
            console.log(foundUser)
            if( !foundUser.token ){
                const token = await sign({ foundUser }, privatekey, { expiresIn : 60*60*10 })
                if(!token) return res.status(404).json({ "message" : "server error" })
                else{
                    foundUser.token = token
                    await foundUser.save()
                    return res.status(200).json({
                        "message" : "logged in successfully",
                        "token" : token
                    })
                }
            }else{
                const verifiedToken = await verify(foundUser.token, privatekey)
                if(!verifiedToken){
                    const token = await sign({ foundUser }, privatekey, { expiresIn : 60*60*10 })
                    if(!token) return res.status(404).json({ "message" : "server error" })
                    else{
                        foundUser.token = token
                        await foundUser.save()
                        return res.status(200).json({
                            "message" : "logged in successfully",
                            "token" : token
                        })
                    }
                }else 
                    return res.status(200).json({
                    "message" : "you have already logged in",
                    "token" : foundUser.token
                    })
            }
        } catch (error) {
            console.log(error)
        }
    },

    async userSignOut(req, res){
        try {
            const token = req.headers.authorization
            const foundUser = await User.findOne({
                where : { token }
            })
            if(!foundUser){
                return res.status(400).json({
                "message" : "invalid credentials"
                })
            }else{
                foundUser.token = null
                await foundUser.save()
                return res.status(200).json({
                    "message" : "logged Out successfully"
                })
            }
        } catch (error) {
            console.log(error)
        }
    },

    // async uploadImage(req, res){
    //     try{
    //         if(req.file == undefined || req.file == null){
    //             res.status(400).json({
    //                 "message" : "files haven't been added"
    //             })           
    //         }else{
    //             const { originalname, buffer } = req.file
    //             const imageContent = await bufferToString( originalname, buffer)
    //             const { secure_url } = await cloudinary.uploader.upload(imageContent)
    //             const userId = 1
    //             const { privacy, title, description  } = req.body
    //             const ImageCreated = await Image.create({ privacy, title, description, userId, imageUrl: secure_url })
    //             res.status(200).json({
    //                 "message" : "image has been created",
    //                 "imageDetails" : ImageCreated
    //             }) 
    //         }
    //     } catch (error) {
    //         console.log(error, 'err')
    //     }
    // }
}