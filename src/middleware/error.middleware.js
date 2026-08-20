const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json ({
        success: false,
        message: err.message || "Internal Server error is here O!!"
    });

    next()
};

export { errorHandler }