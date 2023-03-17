// first would be the creation of the validation schema for the user
const { check, validationResult } = require("express-validator")




//user validation schema
exports.userValidationSchema = [
    check("name","full name is required").notEmpty()
    .isLength({min:3}).withMessage("full name is too short"),

    
    
    check('email',"email is required").notEmpty()
    .isEmail().withMessage("please enter a valid email"),

    check('username',"username is required").notEmpty()
    .isLength({min:3}).withMessage("the entered username should be more than 3 characters long"),

    check('age',"age is required").notEmpty()
    
    .isNumeric().withMessage("the entered age is not a number"),

    check('password',"password is required").notEmpty()
    .isLength({min:6}).withMessage("the entered password must be 6 to 32 characters long")
    .isLength({max:32}).withMessage("the entered password must be 6 to 32 characters long"),
// i can put matches method for lowercase,uppercase and alphanumeric numbers but i have not put them here
    check("phone","phone number is required").notEmpty()
    .isMobilePhone().withMessage("the entered phone number is invalid. It should be 10 digits")
//     .isNumeric().withMessage("the entered value is not a number")
// .isLength({min:10,max:10}).withMessage("the entered number is invalid")



] 


// a validation schemma is also required for signin and resetting the password for the user to atleast enter some data 
exports.signValidationSchema = [
    check('email',"email is required").notEmpty()
    .isEmail().withMessage("the entered email is too short"),
    check('password',"password is required").notEmpty()
    .isLength({min:6}).withMessage("the entered password must be 6 to 12 characters long")
    .isLength({max:12}).withMessage("the entered password must be 6 to 12 characters long")
]


// this is for forgot password validation 
exports.forgotValidationSchema = [

    check('email',"email is required").notEmpty()
    .isEmail().withMessage("the entered email is too short"),

]



// this is for the resetting of the password 
exports.resetValidationSchema = [
    check('password',"password is required").notEmpty()
    .isLength({min:6}).withMessage("the entered password must be 6 to 12 characters long")
    .isLength({max:12}).withMessage("the entered password must be 6 to 12 characters long")   
]




// for displaying the errors during the validation 
exports.validation = (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        next()
    }
    else{
       return res.status(400).json({error: errors.array()[0].msg})
    // return res.status(400).json({error: "there is some error with the entered value"})

    }
}
