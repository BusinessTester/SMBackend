// all the required packages
const User = require("../model/UserModel")
const Token = require("../model/tokenModel")
const crypto = require("crypto")
const sendingEmail = require("../middleware/sendingEmail")
const jwt = require("jsonwebtoken")
const { json } = require("body-parser")
const { findByIdAndRemove } = require("../model/UserModel")


// writing the functions for the addition, viewing, removal and update of the user information



exports.addingUser = async(req,res)=>{
let user = await User.findOne({email:req.body.email})
if(user) {return res.status(400).json({error: 'the email already exists, login with the same email or register using a new one'})}
else{
    // since the user hasnot been registered yet, first the user email registeration is done and then 

    // the required token is sent to the user
    let new_user = new User({
        name:req.body.name,
        username:req.body.username,
        age:req.body.age,
        phone:req.body.phone,
        email:req.body.email,
        password:req.body.password,
        purchases:req.body.purchases
    })
    new_user = await new_user.save()
    if(!new_user) return res.status(400).json({error:"there was some error in registering the account with the entered email"})

    else{
        let token = new Token({
            token:crypto.randomBytes(16).toString("hex"),
            userId:new_user._id
        })
        token = await token.save()
        if(!token) return res.status(400).json({error:"there is something wrong with the generation of token"})
        

        // const url = `http://localhost:5000/api/confirmuser/${token.token}`
//         const url =    `http://localhost:3000/confirmation/${token.token}`
//          const url = `https://starlit-cucurucho-119636.netlify.app/confirmation/${token.token}`
//        const url = `https://voluble-malabi-06f128.netlify.app/confirmation/${token.token}`
       const url = `https://rainbow-meerkat-3eec3f.netlify.app/confirmation/${token.token}`

        // next is the sending of the email
        sendingEmail({
            from:"businesstester945@gmail.com",
            to:new_user.email,
            subject: `email verification`,
            text: ` please click on the button below for the account verification`,
            html:`<a href=${url} target='_blank' rel='noreferrer'><button>click here to verify email</button></a>`
        })
        res.send(new_user)
    }
}
}

// next is the confirming the user function 
exports.confirmUser = async(req,res)=>{
let token = await Token.findOne({token:req.params.token})
if(!token) return res.status(400).json({error:"the token could not be found or has expired"})

else{
    let user = await User.findOne({_id:token.userId})
    if(!user) return res.status(400).json({error:"there was an error with finding the user"})
    else{
        if(user.isVerified) return res.status(400).json({error:"the user is verified. please login to continue"})
        else{
            user.isVerified = true
            user = await user.save()
            if(!user) return res.status(400).json({error:"something went wrong"})
            res.status(200).json({message:"the user is verified successfully and the login is activated"})

        }
    }
}
}

// next is for sending the reconfirmation message to the user 
// following are the conditions that need to be fulfilled in order for us to resend the token for the confirmation of the user 
exports.resendconfirmation = async(req,res)=>{
    // 1. the user email should be the one used earlier 
    let user = await User.findOne({email:req.body.email})

    if(!user) return res.status(400).json({error:"the entered email is not the same as before. please use the email used previously or relogin with a new one"})

    // 2. verifying if the password is the one used earlier for the login information 
    if(!user.authenticated(req.body.password)) return res.status(400).json({error:"either the email or the password dont match"})

    // 3. check if the user is already verified or not 
    if(user.isVerified) return res.status(400).json({error:"the entered email has already been verified. please login with the email and the password"})
    
    
    // 4. finally all the checks are over and the user is sent a new token 
    let token  = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id

    })
    token = await token.save()
    if(!token) return res.status(400).json({error:"there was an error while saving the token"})

    // const url = `http://localhost:5000/api/confirmuser/${token.token}`
//     const url =    `http://localhost:3000/confirmation/${token.token}`
           const url = `https://rainbow-meerkat-3eec3f.netlify.app/confirmation/${token.token}`



    // next is the sending of the email
    sendingEmail({
        from:"businesstester945@gmail.com",
        to:user.email,
        subject: `email verification`,
        text: ` please click on the button below for the account verification`,
        html:`<a href=${url}><button>click here to verify email</button></a>`
    })

    res.status(200).json({message:"the verfication link has been sent again"})

}


// this is for signing in the user 


exports.signin = async(req,res)=>{
// several conditions need to be fulfilled for this to work
// deconstructing 
const {email,password} = req.body

// 1. checking in if the user email exists or not

let user = await User.findOne({email})

if(!user) return res.status(400).json({error:"the email does not exist. please signup and verify the email again"})

// 2. check if the password match with the entered email
if(!user.authenticated(password)) return res.status(400).json({error:"the entered email or the password does not match"})


// 3. checking if the user is already verified or not
if(!user.isVerified) return res.status(400).json({error:"the entered email has not been verified yet please verify the email before logging in"})


// after confirming that the user email is verified, it can now be used to login 
let tokens = jwt.sign({_id:user._id,user:user.role},"SECRET_KEY") 

// next is the saving of the information of the user for the time being 
// for this cookies is used 
res.cookie("myCookies",tokens,{expire:Date.now()+86400})


const {name,_id,role,username,phone} = user
return res.status(200).json({tokens,user_info:{name,_id,role,email,username,phone}})


}


// signing out 

exports.signout = (req,res)=>{
    res.clearCookie("myCookies")
    res.status(200).json({message:"you have successfully logged out"})
}


// time to include the forgotten password link 
exports.forgottenpassword = async(req,res)=>{
    // 1. cheking if the email is valid or not 
    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400)/json({error:"the email does not exist. please register again with the email before continuing"})

let token = new Token({
    token:crypto.randomBytes(16).toString("hex"),
    userId:user._id,

})
token = await token.save()
if(!token) return res.status(400).json({error:"the token could not be saved "})


// const url = `http://localhost:5000/api/confirmuser/${token.token}`
const url =    `http://localhost:3000/resetpassword/${token.token}`
// const url = `https://voluble-malabi-06f128.netlify.app/resetpassword/${token.token}`
// const url = `https://voluble-malabi-06f128.netlify.app/resetpassword/${token.token}`
//        const url = `https://rainbow-meerkat-3eec3f.netlify.app/resetpassword/${token.token}`

    


    // next is the sending of the email
    sendingEmail({
        from:"businesstester945@gmail.com",
        to:user.email,
        subject: `email verification for resetting the password`,
        text: ` please click on the button below for the account verification`,
        html:`<a href=${url}><button>click here to verify email</button></a>`
    })
res.status(200).json({message:"please activate your account by clicking on the link that has been sent to you in the email"})
// res.send(user)
}


// time for resetting the password now
exports.resetpassword=async(req,res)=>{
    // checking if the token has been activated or not
    let token = await Token.findOne({token:req.params.token})
    if(!token) return res.status(400).json({error:"the token cannot be found. try again or contact the system provider"})

    let user = await User.findById(token.userId)
    // this did not work so i am trying to use the confirmation method for the validation of user
    // let user = await User.findOne({_id:token.userId})



    if(!user) return res.status(400).json({error:"the user cannot be found for the token provided "})

    user.password = req.body.password
    user = await user.save()

    if(!user) return res.status(400).json({error:"the user cannot be saved at the moment. Try again or contact the system provider"})
 
    
    res.status(200).json({message:"the password has been reset"})

    
}

// this is for listing the users
exports.listusers = async(req,res)=>{
    let user = await User.find()
    if(!user) return res.status(400).json({error:"there was someting wrong with displaying the users"})

    res.send(user)

}


// time for deleting the user 
exports.deleteuser = async(req,res)=>{
    let user = await User.findByIdAndRemove(req.params.id)

    if(!user) return res.status(400).json({error:"deletion was not successful"})

    res.status(200).json({message:"the user has been deleted successfully"})

}


// this is me trying to create a function that can display the purchases made by the user 
exports.showPurchases = async(req,res)=>{
    const user = await User.findById(req.params.id)

    if(!user) return res.status(400).json({"error":"there was an error with the retreviation of the user details. Please try again later"})

    res.send(user.purchases)


}


// this is for the addition of the purchases 
exports.addPurchases = async(req,res)=>{
    let user = await User.findById(req.params.id)

    if(!user) return res.status(400).json({"error":"there was an error with the retreviation of the user details. Please try again later"})

    // time for the inclusion of purchases using new keyword

    // let user_purchases = User.purchases.push({
    user.purchases.push({

        subject:req.body.subject,
        subject_code:req.body.subject_code,
        subject_link:req.body.subject_link

    })
    
    
   

    user = await user.save()
    if(!user) return res.status(400).json({error:"the purchases couldn't be saved"})
    // res.status(200).json({message:"the changes have been made successfully"})
    res.send(user)

}

// this is for updating the contents of the purchases 
// exports.updatePurchases = async(req,res)=>{
//     let user = await User.findById(req.params.id)

//     if(!user) return res.status(400).json({error:"the user could not be found at the moment"})



//      user = await user.purchases.findByIdAndUpdate(req.params.id,{
//        subject:req.body.subject,
//        subject_code:req.body.subject_code,
//        subject_link:req.body.subject_link


//     })

//     user = await user.save()
//     if(!user) return res.status(400).json({error:"the user could not be saved at the moment"})

//     res.send(user)
// }

// this has been discarded for the moment 

// this is to test the email sending strength of nodemailer 
exports.makeRequest = async(req,res)=>{
    try {
        let user = await User.findById(req.params.id)
        if(!user) return res.status(400).json({error:"the searched user could not be found try again or contact system adminstrator"})

// const {emailhtml} = req.body

       await sendingEmail({
            from:"businesstester945@gmail.com",
            to:user.email,
            subject: `email information for ${user.email}`,
            // subject: await req.body.subject,

            // text: ` please click on the button below for the account verification`,

            html:req.body.html,
        
            
            // html:`<a href='#'><button>click here to verify email</button></a>`


        })
        if(sendingEmail){
            res.status(200).json({message:"the email was sent successfully"})
            // res.send(sendingEmail())
        }
        else{
            res.status(400).json({error:"the sending of the email took some time"})
        }

    
    
    } catch (error) {
       res.status(400).json({error:"there was an error while making the request"}) 
    }

}
