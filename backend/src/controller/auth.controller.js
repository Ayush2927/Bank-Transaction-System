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
        }
    });
}

export {userRegister}