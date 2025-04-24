// src/services/fileService.js
import path from 'path';
import fs from 'fs';
import File from '../models/File.js';

export const saveFileInfo = async (filename, originalName, mimetype, size) => {
  const fileData = await File.create({
    filename,
    originalName,
    path: `/uploads/${filename}`,
    mimetype,
    size,
  });

  return {
    id: fileData._id,
    filename: fileData.filename,
    originalName: fileData.originalName,
    path: fileData.path,
    mimetype: fileData.mimetype,
    size: fileData.size,
  };
};

export const getFilePath = (filename) => {
  const filePath = path.resolve(`./src/uploads/${filename}`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Dosya bulunamadı.');
  }

  return filePath;
};
