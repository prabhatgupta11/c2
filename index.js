
const express=require("express")
const { connection } = require("./db")
const{userrouter}=require("./routes/userroutes")
const {blogrouter} = require("./routes/blog.routes")
const { authentication } = require("./middleware/authentication")
require('dotenv').config()
const app=express()
app.use(express.json())



app.use("/user",userrouter)


app.use(authentication);

app.use("/blog", blogrouter );


//listing part

app.listen(process.env.port,async()=>{
    try{
await connection
console.log("connected to db")
    }catch(err){
console.log(err)
    }

    console.log("connected to database")
})