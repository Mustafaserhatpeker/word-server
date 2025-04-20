require('dotenv').config();
import express, { json } from 'express';
const app = express();
import routes from './src/routes';
import { connectDB } from './src/config/database';

app.use(json());
app.use('/api', routes);

// Hata yakalayıcı middleware
app.use(require('./src/middlewares/errorHandler'));

// Sunucu başlat
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
