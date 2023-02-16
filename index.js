const express = require('express')
const  app = express()

// importing the user router
const User = require("./route/userRoute")
const Subject = require("./route/subjectRoute")

require('dotenv').config()

const db = require('./Database/connection')
const port = process.env.PORT
const cors = require("cors")

// next is the use of body-parser

const bodyParser = require("body-parser")


// use of the middleware 

app.use(cors(
//     {
//     origin:`http://localhost:3000`,
//     Header:("Access-Control-Allow-Origin","*")
// }
)
)
app.use(bodyParser.json())
// connection with the userRouter 
app.use("/api",User)
// this is for the establishment of the connections with the subject router
app.use("/api",Subject)





// running the console for the first time 

// this part has been commented out since the connection to the database has been established using mongodb and there 
// is no need for the connection to the earlier console as it is only going to create the error  

app.listen(port,()=>{
console.log(`this message has been posted on the   ${port}`)
})


// testng out with the function
app.get('/first',(req,res)=>{
    res.send("this is the text to see if the server is working or not for the backend")
})

// the next process would be to connect to the mongodb server and utilize its 512 MB of sapce available for the database  