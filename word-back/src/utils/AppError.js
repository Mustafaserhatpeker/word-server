// src/utils/AppError.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  
    static badRequest(message = 'Geçersiz istek.') {
      return new AppError(message, 400);
    }
  
    static unauthorized(message = 'Yetkisiz.') {
      return new AppError(message, 401);
    }
  
    static forbidden(message = 'Erişim engellendi.') {
      return new AppError(message, 403);
    }
  
    static notFound(message = 'Kaynak bulunamadı.') {
      return new AppError(message, 404);
    }
  
    static conflict(message = 'Çakışma meydana geldi.') {
      return new AppError(message, 409);
    }
  
    static internal(message = 'Sunucu hatası.') {
      return new AppError(message, 500);
    }
  }
  
  export default AppError;
  