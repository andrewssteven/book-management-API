export const authorizedRole = (...userRole) => {
    return (req, res, next) => {
        if(!userRole.includes(req.user.role)){
            return res.status(403).json({status: "failed", message: "Access denied"})
        }
        next()
    }
}