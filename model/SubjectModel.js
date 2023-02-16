const mongoose = require('mongoose')

const SubjectModelSchema = mongoose.Schema({
    subject_code:{
        type:String,
        default:"NA"
    },
    subject:{
        type:String,
        default:"NA"
    },
    price:{

        type:Number,
        default:"NA"
    
    },
    field:{
        
        type:String,
        default:"NA"
    },
    university:{
        type:String,
        default:"NA"
    },
    college:{
        type:String,
        default:"NA"
    },
    level:{
        type:String,
        default:"NA"
    },
    uploader:{
        type:String,
        default:"NA"
    },
    review:{
        type:String,
        default:"NA"
    },
    preview:{
        type:String,
        default:"NA"
    },
    contact:{
        type:String,
        default:"NA"
    }
},{timestamps:true})

module.exports = mongoose.model("Subject",SubjectModelSchema)