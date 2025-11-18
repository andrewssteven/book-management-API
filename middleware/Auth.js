import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        const error = new Error(`Please login and provide token`)
        error.status = 401;
        next(error)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, myuser) => {
        if(err){
        const error = new Error("Invalid token provided");
        error.status = 403; 
        return next(error);          
        }
        req.user = myuser
        next()
    })
}