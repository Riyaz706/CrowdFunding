import exp from "express";
import { userModel } from "../models/userModel.js";
import {hash} from "bcrypt"
import { authentication, register } from "../services/authService.js";

const commonApp = exp.Router();
export default commonApp;

// register user(public)
commonApp.post("/register",async(req,res,next)=>{
    try {
        let newUserDoc = await register(req.body);
        res.status(201).json({message:"user created successfull", payload: newUserDoc});
    } catch (err) {
        next(err);
    }
})

// authenticated user or admin(public)
commonApp.post("/login",async(req,res,next)=>{
    try {
        // get user credentials obj
        let userCred = req.body;
        // call authenticate service
        let { token, user } = await authentication(userCred);
        // save token as httpOnly
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: '/'
        })
        // send res
        res.status(201).json({ message: "user login success" , payload:user})
    } catch (err) {
        next(err);
    }
})

// logout
commonApp.post("/logout",async(req,res)=> {
    res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        
    });
    res.status(200).json({message:"logout successful"});
})
