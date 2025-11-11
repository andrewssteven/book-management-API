import { Router } from "express";
import { bookController } from "../controller/book.js";
import { validate } from "../middleware/validator.js";

const router = Router()

// endpoint: add a book to database
router.post('/', validate, bookController.postBook)
// endpoint: get all available books
router.get('/', bookController.getBook)
// endpoint: get a book by id
router.get('/:id', bookController.getBookId)
// endpoint: search book by author
router.get('/author/:author', bookController.getBookAuthor)
// endpoint: search book by year
router.get('/year/:year', bookController.getBookYear)
// endpoint: search for book by genre
router.get('/genre/:genre', bookController.getBookGenre)
// endpoint: get book by id and update book details
router.put('/:id', bookController.updateBook)
// endpoint: delete book from database
router.delete('/:id', bookController.deleteBook)


export default router