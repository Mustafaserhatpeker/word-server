import app from './app.js';
import { connectDB } from './src/config/database.js';


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
