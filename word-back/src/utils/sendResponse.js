// src/utils/sendResponse.js

export const sendResponse = (res, statusCode, data = {}, message = null) => {
    res.status(statusCode).json({
      status: 'success',
      ...(message && { message }),
      data,
    });
  };
  