// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Sunucuda bir hata oluştu.';
  
    res.status(statusCode).json({
      status: 'error',
      message,
    });
  };
  