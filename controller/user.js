import { User } from "../models/Users.js"
import { Token } from "../models/RefreshToken.js"
import dotnev from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotnev.config()

export const userController = {
    register: async (req, res, next) => {
        try{
            // hash password 
            const hasedpassword = await bcrypt.hash(req.body.password, 10)
            const newuser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hasedpassword
            })
            
            // check is user email already exist and return error if true
            let exisitngUser = await User.find({email: newuser.email})
            if(exisitngUser){
                const error = new Error(`user with email ${newuser.email} already exist. Try a new one`)
                error.status = 400;
                next(error) 
            }
            await newuser.save()
            let users = await User.find()
            res.status(201).json({status: "success", data: users })
        }
        catch{
            (error)=>{console.error(error)}
        }
    },
    Login: async (req, res, next) => {

        // find user account by email. can be changed to username later.
        const user = await User.findOne({email: req.body.email})
        if(!user){
            const error = new Error(`User with email ${user.email} not registered`)
            error.status = 404;
            next(error)
        }

        // logic to my user to user name and generate accesstoken
        const myuser = {name: user.name}
        // access token
        const generateAccesstoken = (myuser) => {
            return jwt.sign(myuser, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
        }
        const accestoken = generateAccesstoken(myuser)

        // refresh token
        const refreshToken = jwt.sign(myuser, process.env.REFRESH_TOKEN_SECRET)
        console.log(refreshToken);
        const newToken = new Token({token: refreshToken})
        newToken.save()

        // logic to compare found user password and return succes if password match
        try{
            if(await bcrypt.compare(req.body.password, user.password)){
                res.status(200).json({status: "success", message: "user succefully logged in", accesToken: accestoken, refreshToken: refreshToken })
            }
            else{
                res.status(400).json({status: "failed", message: "incorrect username or password" })
            }
        }
        catch(error){
            next(error)
        }
    },
    refresToken: async (req, res, next) => {
        const refresToken = req.body.token
        if(!refresToken){
            const error = new Error (`Token Required`)
            error.status = 401;
            next(error)
        }
        const savedToken = await Token.findOne({token: refresToken})
        if(!savedToken){
            const error = new Error(``)
            error.status(403)
            next(next) 
        }
        jwt.verify(refresToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) {
                const error = new Error('Invalide token')
                error.status = 403;
                next(error)
            }
            const generateAccesstoken = (myuser) => {
            return jwt.sign(myuser, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
            }
            const accesstoken = generateAccesstoken({name: user.name})
            res.status(200).json({status: "success", accesstoken: accesstoken})
        })
    },
    getUsers: async (req, res, next) => {
        let users = await User.find()
        res.status(200).json(users)
    },
}