/**
 * Global error handling middleware.
 * Must be registered AFTER all routes (4 args = error handler).
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message || err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
