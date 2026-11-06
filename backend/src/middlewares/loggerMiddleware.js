const loggerMiddleware = (req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`
  );

  next();
};

module.exports = loggerMiddleware;