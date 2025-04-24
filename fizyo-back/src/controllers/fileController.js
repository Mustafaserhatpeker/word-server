// src/controllers/fileController.js
import { saveFileInfo, getFilePath } from '../services/fileService.js';
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

    // Veritabanında dosya kaydını bul
    const fileRecord = await File.findOne({ filename });

    if (!fileRecord) {
      return res.status(404).json({ message: 'Dosya kaydı bulunamadı.' });
    }

    // Fiziksel dosya yolunu oluştur
    const filePath = path.resolve(`./src/uploads/${filename}`);

    // Dosya gerçekten sistemde var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Dosya fiziksel olarak bulunamadı.' });
    }

    // Dosyayı gönder
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: 'Dosya getirilirken hata oluştu.', error: err.message });
  }
};
