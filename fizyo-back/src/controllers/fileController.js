// src/controllers/fileController.js
import path from 'path';
import { sendResponse } from '../utils/sendResponse.js';

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }

  sendResponse(res, 200, {
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  }, 'Dosya başarıyla yüklendi.');
};

export const getFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.resolve(`./src/uploads/${fileName}`);
  res.sendFile(filePath);
};
