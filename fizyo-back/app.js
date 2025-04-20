import express from 'express';
import dotenv from 'dotenv';

import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/erorHandler.js';
import cors from 'cors';

app.use(cors());
// Ortam değişkenlerini yükle
dotenv.config();

// Express app başlat
const app = express();


app.use(express.json());


app.use('/api', routes);


app.use(errorHandler);

export default app;