import express from 'express';
import dotenv from 'dotenv';

import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/erorHandler.js';
import cors from 'cors';


// Ortam değişkenlerini yükle
dotenv.config();

// Express app başlat
const app = express();

app.use(cors());
app.use(express.json());
import path from 'path';

app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));


app.use('/api', routes);


app.use(errorHandler);

export default app;