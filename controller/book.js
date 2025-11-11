import Book from "../models/Books.js";
import { validationResult } from "express-validator";

export const bookController = {
    postBook: async (req, res, next) => {
        try{
            const validateError = validationResult(req)
            if(!validateError.isEmpty()) return res.status(404).json({message: validateError.array()})
            let book = new Book(req.body)
            await book.save()
            let allBooks = await Book.find()
            res.status(201).json({status: "success", data: allBooks})
        }
        catch(error){
            next(error)
        }
    },
    getBook: async (req, res, next) => {
        try{
            let book = await Book.find()
            if(!book || book.length === 0) return res.status(200).json({message: "no book available"})
            res.status(200).json({status: "success", data: book})
        }
        catch(error){
            next(error)
        }
    },
    getBookId: async (req, res, next) => {
        try{
            let id = req.params.id
            let book = await Book.findById(id)
            if(!book) return res.status(400).json({success: false, message:`Book with id ${id} not found`})
            res.status(200).json({status: "success", data: book})
        }
        catch(error){
            next(error)
        }
    },
    getBookAuthor: async (req, res, next) => {
        try{
            let author = req.params.author
            if(!author){
                const error = new Error(`${author} not found`)
                error.status = 400;
                next(error)
            }
            let book = await Book.find({author: author})
            if(!book){
                const error = new Error(`Books by ${author} not found`)
                error.status = 400;
                next(error)
            }
            res.status(200).json({status: "success", data: book})
        }
        catch(error){
            next(error)
        }
    },
    getBookYear: async (req, res, next) => {
        try{
            let year = parseInt(req.params.year)
            let book = await Book.find({year: year})
                if(!book){
                    const error = new Error(`No book found of ${year} genre available`)
                    error.status = 400;
                    next(error)
                }       
                res.status(200).json({status: "success", data: book})
        }
        catch(error){
            next(error)
        }
    },
    getBookGenre: async (req, res, next) => {
        try{
            let genre = req.params.genre
            let book = await Book.find({genre: genre})
            if(!book){
                const error = new Error(`No book found of ${year} genre available`)
                error.status = 400;
                next(error)
            }
            res.status(200).json({status: "success", data: book})
        }
        catch(error){
            next(error)
        }
    },
    updateBook: async (req, res, next) => {
        try{
            let id = req.params.id
            let book = await Book.findByIdAndUpdate(id, req.body)
            if(!book){
                const error = new Error(`book with id ${id} not found`)
                error.status = 400;
                next(error)
            }
            let updateBook = await Book.find()
            res.status(200).json({status: "success", data: updateBook})
        }
        catch(error){
            next(error)
        }
    },
    deleteBook: async (req, res, next) => {
        try{
            let id = req.params.id
            let book = await Book.findByIdAndDelete(id)
            if(!book){
                const error = new Error(`book with id ${id} not found`)
                error.status = 400;
                next(error)
            }
            let updateBook = await Book.find()
            res.status(200).json({status: "success", data: updateBook})
        }
        catch(error){
            next(error)
        }
    }
}

