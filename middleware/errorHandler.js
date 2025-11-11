export const errorHandler = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).json({status: "failed", message: err.message})
    }
    else{
        res.status(500).json({status: "failed", message: err.message})
    }
}

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found`)
    error.status = 404;
    next(error)
}