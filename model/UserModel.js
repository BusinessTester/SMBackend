// this is for the establishment of the user information and collection of the names of the user
// followed by the email and the password of the user
// for this one we will be trying to include the required packages only when the time for the packages 
// come

const mongoose = require("mongoose")
const crypto = require('crypto')

const uuidv1 = require("uuidv1")

const schemaUser = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    hashed_password:{
        type:String,
        // required:true
    },
    purchases:[
        {subject: {
        type:String,
        default:"NA"
    },
    subject_code:{
        type:String,
        default:"NA"
                 },
    subject_link:{
    type:String,
    default:"NA"
      }
}
],
    
    role:{
        type:Number,
        default:1
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    salt:String
},{timestamps:true})


// next stage is to save the password in the virtual state and carry out the hashing of the password
schemaUser.virtual("password")
.set(
    function(password){
        this._password=password
        // using an underscore is for hiding the code and is one of the methods of data encapsulation 
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    }
)
.get(
    function(){
        return this.password
    }

)
//next is the application of the methods for the schemaUser

schemaUser.methods = {
    encryptPassword:function(password){
        if(password==null) return ''
        try {
            return crypto.Hmac("sha1",this.salt)
            .update(password)
            .digest("hex")
        } catch (error) {
            return ''
        }
    },
    authenticated:function(password){
        return this.hashed_password === this.encryptPassword(password)
    }
}

module.exports = mongoose.model("User",schemaUser)
// the next steps are to configure the controller section for the user login 