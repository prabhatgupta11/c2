const express = require("express");
const { UserModel } = require("../model/usermodel");
const jwt=require("jsonwebtoken")
const {blacklist}=require("../model/blacklist")
require("dotenv").config()

const bcrypt = require('bcrypt');
const userrouter = express.Router();

//register the user

userrouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const isuserpresent = await UserModel.findOne({ email });

    if (isuserpresent) {
      return res
        .status(400)
        .send({ msg: "user already present please login!" });
    }

    const hashpass=bcrypt.hashSync(password,8);

    const newuser= new UserModel({name,email,password:hashpass,role})
    await newuser.save();
    res
    .status(200)
    .send({ msg: "user register" });
  } catch (err) {

    res
    .status(400)
    .send({ msg: "wennt wroong in user register"});
    console.log(err)
  }
});




// userrouter.post("/signup",async(req,res)=>{
//     const {name,email,password,role}=req.body
//     try {
//         const userexit=await UserModel.findOne({email})
//         if(userexit){
//             res.send("user already exists")
//         }
//         const hash=bcrypt.hashSync(password,8)
//         const user =new UserModel({name,email,password:hash,role})
//         await user.save()
//         res.send({user})
//     } catch (error) {
//         console.log(error);
//         res.send("something went wrong")
//     }
// })


userrouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            res.send("invalid email")
        }
        const passmatch=await bcrypt.compareSync(password,user.password)
        if(!passmatch){
            res.send("invalid pas")
        }
        const token=jwt.sign({userId:user._id},"masai",{
            expiresIn:60
            
        })
        const refrestoken=jwt.sign({userId:user._id},"masai",{
            expiresIn:180
            
        })
        res.send({token,refrestoken})
      
    } catch (error) {
        console.log(error);
        res.send("something went wrong")
    }
})
userrouter.get("/refreshtoken",(req,res)=>{
    const refres_token=req.headers.authorization.split
    if(!refres_token){
        res.send("please log in first")
    }
    jwt.verify(refres_token,process.env.reftokensecretkey,(err,decoded)=>{
        if(err){
            res.send("please login again")
        }else{
            const token=jwt.sign({userId:decoded.userId},process.env.tokensecretkey,{
                expiresIn:60
                
            }) 
            res.send({token})
        }

    })
    
})
userrouter.get("/logout",(req,res)=>{
blacklist.push(req.headers?.authorization?.split(" ")[1])
res.send("logout successful")
})
module.exports={
    userrouter
}