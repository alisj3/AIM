import { startBot } from './bot.js';
import express from 'express';
import dotenv from 'dotenv';
import { startConsicous } from './conscious.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`HTTP-сервер запущен и слушает порт ${PORT}`);
});

startBot();
startConsicous();