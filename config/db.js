import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
const mydb = process.env.MONGO_URL

const connectdb = () => {
    try{
        mongoose.connect(mydb).then(() => console.log("database connected successfully")).catch((error)=> console.error(error))
    }
    catch(error){
        console.log(error);   
    }
} 

export default connectdb