import { saveFileInfo, getFileInfo } from '../services/fileService.js';
import { sendResponse } from '../utils/sendResponse.js';


export const uploadFileController = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }

  const { filename, originalname, mimetype, size } = req.file;

  const fileInfo = await saveFileInfo(filename, originalname, mimetype, size);

  // Dosya URL'sini oluştur
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

  sendResponse(res, 200, { ...fileInfo, url: fileUrl }, 'Dosya başarıyla yüklendi ve kaydedildi.');
};



export const getFileController = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const { fileRecord } = await getFileInfo(filename);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    res.status(200).json({
      ...fileRecord.toObject(),
      url: fileUrl
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
