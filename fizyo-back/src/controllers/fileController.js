// src/controllers/fileController.js
import { saveFileInfo, getFileInfo } from '../services/fileService.js';
import { sendResponse } from '../utils/sendResponse.js';


export const uploadFileController = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }

  const { filename, originalname, mimetype, size } = req.file;

  const fileInfo = await saveFileInfo(filename, originalname, mimetype, size);

  sendResponse(res, 200, fileInfo, 'Dosya başarıyla yüklendi ve kaydedildi.');
};




export const getFileController = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const { fileRecord, filePath } = await getFileInfo(filename);

    
    res.type(fileRecord.mimetype);
    res.sendFile(filePath);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
