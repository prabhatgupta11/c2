const mongoose=require("mongoose")

const userschema=mongoose.Schema({
    name:String,
    emai:String,
    password:String,
    role:{type: String, enum:["user","moderator"],default:"user" }
})

const UserModel=mongoose.model("user",userschema)
module.exports={
    UserModel
}