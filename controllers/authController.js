const User = require('../models/userModel.js');
const createError = require('../utils/appError.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.view = async(req, res ,next)=>{
    res.json({message:"website is welcoming"})
};

// REGISTER USER
exports.signup = async (req , res , next)=>{
    try {
        const user = await User.findOne({ email:req.body.email });

        if(user){
            return next(new createError('User already exist!',400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password,12);

        const newUser = await User.create({
            ...req.body,
            password:hashedPassword,
        });

        // Assign JWT( json web token) to user
        const token = jwt.sign({ _id: newUser.id },'secretkey123',{
            expiresIn:'90d',
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user:{
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
        });
    } catch (error) {
        next(error);
    }
};

//LOGGING USER
exports.login = async (req , res , next)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({ email });

        if(!user)
            {
                return next(new createError('user not found!',404));
            }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid)
            {
               return next(new createError('Invalid credential',401)); 
            }

        const token = jwt.sign({ _id: user.id },'secretkey123',{
            expiresIn:'90d',
        });    

        res.status(200).json({
            status:'success',
            token,
            message:'Logged in successfully',
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
        })
    } catch (error) {
        next(error);
    }
};