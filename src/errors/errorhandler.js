function errorHandler(err, req, res, next) {
    console.error(err)
    if (err) {
        res.status(err.status || 500).json({
            message: err.message || 'Internal server error'
        })
    }
}

export default errorHandler