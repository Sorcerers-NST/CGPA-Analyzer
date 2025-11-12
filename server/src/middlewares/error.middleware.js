/**
 * Global error handling middleware
 * Ensures all errors return JSON responses instead of HTML
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err);

  // Set default status code
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
