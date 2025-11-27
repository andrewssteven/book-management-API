import { User } from "../models/Users.js";
import { Token } from "../models/RefreshToken.js";
import dotnev from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotnev.config();

export const authController = {
  register: async (req, res, next) => {
    try {
      // hash password
      const hasedpassword = await bcrypt.hash(req.body.password, 10);
      const newuser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hasedpassword,
      });

      // check if user email already exists and return error if true
      let existingUser = await User.findOne({ email: newuser.email });
      if (existingUser) {
        const error = new Error(
          `user with email ${newuser.email} already exist. Try a new one`
        );
        error.status = 400;
        return next(error);
      }
      await newuser.save();
      let users = await User.find();
      res.status(201).json({ status: "success", data: users });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    // find user account by email. can be changed to username later.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error(`User with email ${user.email} not registered`);
      error.status = 404;
      return next(error);
    }

    // logic to link user by name and generate accesstoken
    const myuser = { name: user.name, id: user._id, role: user.role };
    // access token
    const generateAccesstoken = (myuser) => {
      return jwt.sign(myuser, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
    };
    const accessToken = generateAccesstoken(myuser);

    // refresh token
    const refreshToken = jwt.sign(myuser, process.env.REFRESH_TOKEN_SECRET);
    const newToken = new Token({ token: refreshToken });
    await newToken.save();

    // logic to compare found user password and return succes if password match
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({
          status: "success",
          message: "login successfull",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "incorrect username or password",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const refreshToken = req.body.token;
      if (!refreshToken) {
        const error = new Error("Token required");
        error.status = 400;
        return next(error);
      }

      const deleted = await Token.findOneAndDelete({ token: refreshToken });
      if (!deleted) {
        const error = new Error (`Refresh token not found`)
        error.status = 404;
        return next(error)
      }
      res.status(200).json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  },
  refresToken: async (req, res, next) => {
    const refresToken = req.body.token;
    if (!refresToken) {
      const error = new Error(`Token Required`);
      error.status = 401;
      next(error);
    }
    const savedToken = await Token.find({ token: refresToken });
    if (!savedToken) {
      const error = new Error(``);
      error.status(403);
      next(next);
    }
    jwt.verify(refresToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        const error = new Error("Invalid token");
        error.status = 403;
        next(error);
      }
      const generateAccesstoken = (myuser) => {
        return jwt.sign(myuser, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });
      };
      const accesstoken = generateAccesstoken({ name: user.name });
      res.status(200).json({ status: "success", accesstoken: accesstoken });
    });
  },
};
