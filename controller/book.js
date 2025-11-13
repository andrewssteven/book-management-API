import Book from "../models/Books.js";
import { query, validationResult } from "express-validator";

export const bookController = {
  postBook: async (req, res, next) => {
    try {
      const validateError = validationResult(req);
      if (!validateError.isEmpty())
        return res.status(400).json({ message: validateError.array() });
      let book = new Book(req.body);
      await book.save();
      let allBooks = await Book.find();
      res.status(201).json({ status: "success", data: allBooks });
    } catch (error) {
      next(error);
    }
  },
  getBook: async (req, res, next) => {
    // pagination(load data by page), filter and search logic
    const page = parseInt(req.query.p) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const search = req.query.search || ""
    const year = req.query.year

    const queryParams = {};

    // if search is provided, search common text fields (title, author, genre, year)
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      queryParams.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { genre: searchRegex },
      ];
    }

    if(year){
        queryParams.year = year;
    }

    const totalBook = await Book.countDocuments(queryParams);

    try {
      let book = await Book.find(queryParams)
        .skip((page - 1) * limit)
        .limit(limit);
      if (!book || book.length === 0)
        return res.status(200).json({ message: "no book available" });
      res.status(200).json({
        status: "success",
        page,
        totalPages: Math.ceil(totalBook / limit),
        totalBooks: totalBook,
        count: book.length,
        data: book,
      });
    } catch (error) {
      next(error);
    }
  },
  getBookId: async (req, res, next) => {
    try {
      let id = req.params.id;
      let book = await Book.findById(id);
      if (!book)
        return res
          .status(400)
          .json({ success: false, message: `Book with id ${id} not found` });
      res.status(200).json({ status: "success", data: book });
    } catch (error) {
      next(error);
    }
  },
  updateBook: async (req, res, next) => {
    try {
      let id = req.params.id;
      let book = await Book.findByIdAndUpdate(id, req.body);
      if (!book) {
        const error = new Error(`book with id ${id} not found`);
        error.status = 400;
        next(error);
      }
      let updateBook = await Book.findById(id);
      res.status(200).json({ status: "success", data: updateBook });
    } catch (error) {
      next(error);
    }
  },
  deleteBook: async (req, res, next) => {
    try {
      let id = req.params.id;
      let book = await Book.findByIdAndDelete(id);
      if (!book) {
        const error = new Error(`book with id ${id} not found`);
        error.status = 400;
        next(error);
      }
      let updateBook = await Book.find();
      res.status(200).json({ status: "success", data: updateBook });
    } catch (error) {
      next(error);
    }
  },
};
