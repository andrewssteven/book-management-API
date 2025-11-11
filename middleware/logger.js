
export const logger = (req, res, next) => {
    const payload = {
        timeStamp: new Date().toISOString(),
        level: "INFO",
        method: req.method,
        url: `${req.protocol}://${req.get('host')} ${req.originalUrl}`,
        ip: req.ip
    }
    console.log(JSON.stringify(payload));
    next()
}