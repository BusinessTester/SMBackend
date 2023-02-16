const express = require("express")
const { addingUser, confirmUser, resendconfirmation, signin, signout, forgottenpassword, resetpassword, deleteuser, listusers, showPurchases, addPurchases, updatePurchases, makeRequest } = require("../controller/userController")
const { userValidationSchema, validation, signValidationSchema, forgotValidationSchema } = require("../validation/validator")


const router = express.Router()

// this is for the creation of the functions 
router.post('/register',userValidationSchema,validation,addingUser)
router.get('/confirmuser/:token',confirmUser)
router.post('/resendconfirmation',resendconfirmation)
router.post('/signin',signValidationSchema,validation,signin)
router.get('/signout',signout)
router.post("/forgotpassword",forgotValidationSchema,validation,forgottenpassword)
router.post("/resetpassword/:token",resetpassword,validation,resetpassword)

router.get('/showpurchases/:id',showPurchases)
router.post('/addpurchases/:id',addPurchases)
// router.put('/updatepurchases/:id',updatePurchases)
router.post('/sendingemail/:id',makeRequest)

router.get("/listusers",listusers)

router.delete("/deleteuser/:id",deleteuser)


module.exports = router

