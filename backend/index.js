const express = require("express");
const app = express();
const {DBConnection}=require('./database/db.js');
const User=require('./models/Users.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

DBConnection();

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/register",async (req,res)=>{
    console.log(req);
    try {
        const{firstname,lastname,email,password}=req.body;

        if(!(firstname,lastname,email,password)){
            return res.status(400).send("Please enter all required fields!");
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).send("User already exists!");
        }

        const hashPassword = bcrypt.hashSync(password, 10);
        console.log(hashPassword);

        const user=await User.create({
            firstname,
            lastname,
            email,
            password:hashPassword,
        })

        const token=jwt.sign({id:user._id,email},process.env.SECRET_KEY,{
            expiresIn:"1h"
        });

        user.token=token;
        user.password=undefined;
        res.status(201).json({
            message:"Registration Succesfull",
            user
        });

        
    } catch (error) {
        console.log(error);
    }
});

app.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body;

        if(!(email && password)){
            return res.status(400).send("Please enter full details");
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(401).send("User not found");
        }

        const entered_password=await bcrypt.compare(password,user.password);
        if(!entered_password){
            return res.status(401).send("Wrong password");
        }

        const token=jwt.sign({id:user._id,email},process.env.SECRET_KEY,{
            expiresIn:"1d"
        });
        user.token=token;
        user.password=undefined;

        const options={
            expires:new Date(Date.now()+1*24*60*60*1000),
            httpOnly:true,
        };

        res.status(200).cookie("token",token,options).json({
            message:"Log in successfull!",
            success:true,
            token,
        });

    } catch (error) {
        console.log(error);
    }
});

app.listen(8000, () => {
  console.log("Server 8000");
});
