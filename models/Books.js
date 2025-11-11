import { Schema, model } from "mongoose";

const bookSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true,
    },
    year: Number,
    genre: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    }
})

const Book = model('Book', bookSchema)
export default Book