// const express = require("express");
// const { BlogsModel } = require("../model/blogs");
// const blogrouter = express.Router();

// //createblog
// blogrouter.post("/addblog",async(req,res)=>{
//     const paylod=req.body
//     {
//         try{
//         const blog=new BlogsModel({paylod});
//         await blog.save()
//         res.status(200).send({msg:"blog added"})
//         }catch(err)
//         {
//             res.status(400).send({msg:"went wrng in blog added"})
//         }
//     }
// })


// //readblog  
// blogrouter.post("/read",async(req,res)=>{
 
//     {
//         try{
//         const blog= BlogsModel.find();
//         res.status(200).send({msg:"All the blogs",blog})
//         }catch(err)
//         {
//             res.status(400).send({msg:"went wrng in blog added"})
//         }
//     }
// })



  
// module.exports = {
//     blogrouter
// };
const { BlogModel} = require("../model/blog.model");
const { Router } = require("express");
const {auth} = require("../middleware/auth");

const blogrouter= Router();

blogrouter.get("/all", async (req,res)=>{
    try{
        const blog = await BlogModel.find();
        res.send({ blog })
    }
    catch(error){
        res.status(500).send({msg:error.message});
    }
});

blogrouter.post("/addBlog",  async(req,res) =>{
    try{
        const blog = new BlogModel(req.body);
        await blog.save();
      
    }catch(error){
        res.status(500).send({msg:error.message});
    }
}
);

blogrouter.post("/deleteBlog/:blogId",   auth('moderator'),async (req,res) =>{
    try{
        const { blogid} = req.params;

    const blog = await BlogModel.find({blogid});
    if(blog.moderatorid == req.body.userId){
        await BlogModel.deleteMany({blogid});
        res.send({msg: "blog deleted"})
    }
    else {
        res.status(403).send({msg: "not autherized"});
    }
    }
    catch(error){
        res.status(500).send({msg:error.message});
    }
});

module.exports = { blogrouter}