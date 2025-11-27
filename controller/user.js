import { User } from "../models/Users.js";
import { Token } from "../models/RefreshToken.js";
import dotnev from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotnev.config();

export const userController = {

  getUsers: async (req, res, next) => {
    try{
        let users = await User.find();
        if(!users){
            res.status(209).json({status: "success", data: users})
        }
        res.status(200).json(users);
    }
    catch(error){
        next(error)
    }
  },
  getUserId: async (req, res, next) => {
        try{
            const id = req.params.id
            const user = await User.findById(id)
            if(!user){
                const error = new Error(`User with id ${id} not registered`)
                error.status = 404;
                return next(error)
            }
            res.status(200).json({status: "success", data: user})
        }
        catch(error){
        next(error)
        }
  },
  updateUser: async (req, res, next) => {
    try{
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id)
    if(!user){
        const error = new Error (`User with id ${id} not found, try again with a valid id`)
        error.status = 404;
        return next(error)
    }
    const updateUser = await User.findById(id)
    res.status(200).json({status: "success", data: updateUser })
    }
    catch(error){
        next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    try{
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if(!user){
            const error = new Error (`User with id ${id} not found, try again with a valid id`)
            error.status = 404;
            return next(error)
        }
        res.status(200).json({status: "success", message: "User deleted"})
    }
    catch(error){
        next(error)
    }
  }
};
