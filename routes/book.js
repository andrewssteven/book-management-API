import { Router } from "express";
import { bookController } from "../controller/book.js";
import { validate } from "../middleware/validator.js";
import { authenticate } from "../middleware/Auth.js";

const router = Router();

// endpoint: add a book to database
router.post("/", authenticate, validate, bookController.postBook);
// endpoint: get all available books
router.get("/", authenticate, bookController.getBook);
// endpoint: get a book by id
router.get("/:id", authenticate, bookController.getBookId);
// endpoint: get book by id and update book details
router.put("/:id", authenticate, bookController.updateBook);
// endpoint: delete book from database
router.delete("/:id", authenticate, bookController.deleteBook);

export default router;
