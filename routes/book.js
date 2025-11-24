import { Router } from "express";
import { bookController } from "../controller/book.js";
import { validate } from "../middleware/validator.js";
import { authenticate } from "../middleware/Auth.js";
import { authorizedRole } from "../middleware/roleAuth.js";

const router = Router();

// endpoint: add a book to database
router.post("/", authenticate, authorizedRole("admin"), validate, bookController.postBook);
// endpoint: get all available books
router.get("/", authenticate, authorizedRole("user", "admin"), bookController.getBook);
// endpoint: get a book by id
router.get("/:id", authenticate, authorizedRole("user", "admin"), bookController.getBookId);
// endpoint: get book by id and update book details
router.put("/:id", authenticate, authorizedRole("admin"), bookController.updateBook);
// endpoint: delete book from database
router.delete("/:id", authenticate, authorizedRole("admin"), bookController.deleteBook);

export default router;
