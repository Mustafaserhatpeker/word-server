// src/controllers/fileController.js
import { saveFileInfo, getFilePath } from '../services/fileService.js';
import { sendResponse } from '../utils/sendResponse.js';

export const uploadFileController = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }

  const fileInfo = await saveFileInfo(req.file.filename);

  sendResponse(res, 200, fileInfo, 'Dosya başarıyla yüklendi.');
};

export const getFileController = (req, res, next) => {
  try {
    const filePath = getFilePath(req.params.filename);
    res.sendFile(filePath);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
