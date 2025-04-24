// src/services/fileService.js
import path from 'path';
import fs from 'fs';

export const saveFileInfo = async (filename) => {
  // Gerekirse veritabanına yazabilirsin, şimdilik sadece adını döndürelim
  return {
    filename,
    path: `/uploads/${filename}`,
  };
};

export const getFilePath = (filename) => {
  const filePath = path.resolve(`./src/uploads/${filename}`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Dosya bulunamadı.');
  }

  return filePath;
};
