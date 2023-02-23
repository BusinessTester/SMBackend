// this is for the connection to the mongodb database using the password provided on the database
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
// this line of code has been made a mandatory for the newest version of mongodb and i added this line just as recommended by the 
// console.log error screen
// mongoose.connect(`mongodb+srv://supreme_emperor:Sunrise111!@cluster0.s3xf8tr.mongodb.net/?retryWrites=true&w=majority`,{
mongoose.connect(`mongodb+srv://StudyMaterialsNepal:RPyoLHlCEAqPeYdO@studymaterialscluster.bkphpsf.mongodb.net/?retryWrites=true&w=majority`,{

    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(()=>{
    console.log("the connection to the server has been established for the database")

})
.catch(error=>console.log(error))
