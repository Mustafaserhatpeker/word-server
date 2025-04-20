// src/middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Konsola loglama isteğe bağlı
  
    res.status(500).json({
      message: err.message || 'Bilinmeyen bir hata oluştu.',
    });
  };
  