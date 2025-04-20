import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/erorHandler.js';

// Ortam değişkenlerini yükle
dotenv.config();

// Express app başlat
const app = express();


app.use(express.json());


app.use('/api', routes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
