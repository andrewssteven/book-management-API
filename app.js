import express from "express";
import cors from "cors";
import connectdb from "./config/db.js";
import router from "./routes/book.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { limit } from "./middleware/rateLimit.js";
import userrouter from "./routes/user.js";

const app = express();
const allowedOrigins = [
    'http://localhost:3030', 
    'http://localhost:8080', 
    'https://sitedomain.com'
]

// middleware
app.use(limit)
app.use(express.json());
app.use(cors({origin: allowedOrigins}));
app.use(express.urlencoded({ extended: false }));
app.use(logger)

// db connection
connectdb();

// base route
app.get("/", (req, res) => {
  res.status(200).json({ message: "server running successfully" });
});

// books routes
app.use("/api/v1/books", router);
app.use("/api/v1/users", userrouter)

// error handler middleware
app.use(notFound);
app.use(errorHandler);

export default app;
