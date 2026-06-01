import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

//User register controller
//Post /api/auth/register

async function userRegister(req,res){
    const {email,password,name}=req.body;

    const ifExists = await User.findOne({
        email:email
    });

    if(ifExists){
        return res.status(422).json({
            message:"User already exists with email",
            status:"Failed"
        })
    }

    const user=await User.create({
        email,password,name
    });

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token);

    res.status(201).json({
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        },token
    });
}

async function userLogin(req,res){
    const {email,password} = req.body;

    const user=await User.findOne(
        {email}
    ).select("+password")

    if(!user){
        return res.status(401).json({
            message:"email or password is invalid"
        })
    }

   const isvalidPassword= await user.comparePassword(password);

     if(!isvalidPassword){
    return res.status(401).json({
        message:"password is invalid"
    })
}

   const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token);

    res.status(200).json({
        user: {
            email: user.email,
            _id: user._id,
            name: user.name
        },
        token
    })

}

export {userRegister,userLogin}