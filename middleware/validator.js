import { check } from "express-validator";

export const validate = [
    check('title').notEmpty().withMessage('Book title required'),
    check('year').notEmpty().withMessage('published year required'),
    check('genre').notEmpty().withMessage('Book genre required'),
    check('author').notEmpty().withMessage('Book author required'),
]