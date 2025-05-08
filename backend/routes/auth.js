const express=require("express");
const User=require("../models/user.js");
const bcrypt=require("bcrypt")
const gentoken=require("../utils.js");  
const protectroute=require("../middlewares/authmid.js")
const cloudinary=require('../cloudinary.js');

const router=express.Router();

router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body;
    
    try{
        if(!fullName||!email||!password){
            res.status(401).json({message:"All fields are required"})
        }
        if(password.length<6){
            return res.status(400);
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"email already registered"});
        }
        const salt= await bcrypt.genSalt(10);
        const hashedpassword=await bcrypt.hash(password,salt);

        const newuser=new User({
            fullName,
            email,
            password:hashedpassword
        
        })
        if(newuser){
            await newuser.save();
            console.log("User saved to DB:", newuser);
            gentoken(newuser._id,res);
            res.status(201).json({
                _id:newuser._id,
                fullName:newuser.fullName,
                email:newuser.email,
                profilePic:newuser.profilePic
            })

        }
        else{res.status(400)}

    }catch(error){
        console.log("error",error);
        res.status(500).json({message:"Internal Server Error"})
    }
    
});

router.post("/login",async (req,res)=>{
    const{email,password}=req.body;

    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid creds"})
        }
        const correctpass=await bcrypt.compare(password,user.password);
        if(!correctpass){
            return res.status(400).json({message:"Invalid creds"})

        }
        gentoken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error",error)
        res.status(500).json({message:"internal server error"});    
    }
});


router.post("/logout",async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out"})
        
    } catch (error) {
        console.log("Error",error)
        res.status(500).json({message:"Internal server error"})
        
    }
});

router.put("/update",protectroute,async (req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Upload a pic"});
        }
        const uploadresponse=await cloudinary.uploader.upload(profilePic);
        const updateuser=await User.findByIdAndUpdate(userId,{profilePic:uploadresponse.secure_url},{new:true});
        res.status(200).json(updateuser)
    } catch (error) {
        console.log("Error",error);
        res.status(400).json({message:"Internal error"})
    }

})

router.get("/check",protectroute,async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internall errr"})
    }
})

module.exports=router;