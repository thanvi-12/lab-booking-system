const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  if (err.name === "CastError") statusCode = 400;
  if (err.name === "ValidationError") statusCode = 400;
  if (err.name === "JsonWebTokenError") statusCode = 401;
  if (err.name === "TokenExpiredError") statusCode = 401;
  if (err.code === 11000) statusCode = 409;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = { notFound, errorHandler };