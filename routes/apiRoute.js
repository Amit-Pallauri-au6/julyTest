const express = require('express')
const router = express.Router()
const { 
    userSignUp, 
    userSignIn, 
    userSignOut,
    // uploadImage
} = require('../controllers/apiController')
const authenticate = require('../middleware/authenticate')
// const upload = require('../fileUpload/multer/multer')


router.post('/signUp', userSignUp)
router.post('/signIn', userSignIn)
router.delete('/signOut', userSignOut)
// router.post('/upload', authenticate, upload.single('uploadImage'), uploadImage)

module.exports = router