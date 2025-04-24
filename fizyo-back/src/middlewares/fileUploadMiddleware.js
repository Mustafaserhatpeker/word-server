// src/middlewares/fileUploadMiddleware.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/', 'video/'];
  
    const isAllowed = allowedTypes.some((type) =>
      file.mimetype.startsWith(type)
    );
  
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim veya video dosyaları yüklenebilir.'), false);
    }
  };
  

export const uploadSingleFile = multer({ storage, fileFilter }).single('file');
