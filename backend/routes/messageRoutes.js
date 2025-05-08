const express=require('express');
const protectroute=require('../middlewares/authmid.js');
const user = require('../models/user.js');
const msg=require("../models/message.js")
const cloudinary=require('../cloudinary.js');
const router=express.Router();
const {getReceiverSocketId,io}=require("../socket.js");


//Gets Users for Sidebar
router.get("/user",protectroute,async(req,res)=>{
    try {
        const loggedin=req.user._id;
        const filterus=await user.find({_id:{$ne:loggedin}}).select("-password");
        res.status(200).json(filterus);
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internal error"});
        
    }

})


//Gets Messages
router.get("/:id",protectroute,async(req,res)=>{
    try {
        const {id:userTochatId}=req.params;
        const myId=req.user._id;
        const messages=await msg.find({
            $or:[
                {senderId:myId,receiverId:userTochatId},
                {senderId:userTochatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internal error"})
        
    }
})


//Send Messages
router.post("/send/:id",protectroute,async(req,res)=>{
    try {
        const{text,image}=req.body;
        const{id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageurl;
        if(image){
            const uploadresponse=await cloudinary.uploader.upload(image);
            imageurl=uploadresponse.securel_url;
        }
        const newmessage=new msg({
            senderId,
            receiverId,
            text,
            image:imageurl
        })
        await newmessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId); 
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newmessage",newmessage)
        }

        res.status(201).json(newmessage);

    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internal error"})
        
    }
})

module.exports=router;