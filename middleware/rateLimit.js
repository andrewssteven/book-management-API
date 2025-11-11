import rateLimit from 'express-rate-limit'

export const limit = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: true,
    handler: (req, res) => {
        res.status(429).json({message: `too many attempts, try again later`})
    }
})