import 'dotenv/config';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';
import axios from 'axios';
import db from './firebase-config.js';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Установлен' : 'Не установлен');
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? 'Установлен' : 'Не установлен');

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY переменная окружения не установлена.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function startBot() {
  console.log('Инициализация ботов...');
  try {
    const usersSnapshot = await db.collection('Users').get();
    console.log(`Получено ${usersSnapshot.size} пользователей из базы данных.`);

    if (usersSnapshot.empty) {
      console.log('Нет пользователей с интеграцией Telegram.');
      return;
    }

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const uid = userDoc.id;

      console.log(`Данные пользователя (UID: ${uid}):`, userData);

      try {
        const integrationsSnapshot = await db.collection('Users').doc(uid).collection('integrations').get();

        if (integrationsSnapshot.empty) {
          console.log(`Пользователь с UID ${uid} не имеет интеграций.`);
          continue;
        }

        const telegramDoc = integrationsSnapshot.docs.find(doc => doc.id === 'telegram');

        if (!telegramDoc) {
          console.log(`Пользователь с UID ${uid} не имеет Telegram интеграции.`);
          continue;
        }

        const telegramData = telegramDoc.data();
        const botToken = telegramData.token;
        const botName = telegramData.name;

        console.log(`Токен Telegram интеграции (UID: ${uid}):`, botToken);
        console.log(`Имя Telegram бота (UID: ${uid}):`, botName);

        if (!botToken) {
          console.warn(`Пользователь с UID ${uid} имеет Telegram интеграцию без токена.`);
          continue;
        }

        if (!botName) {
          console.warn(`Пользователь с UID ${uid} имеет Telegram интеграцию без имени бота.`);
        }

        if (!/^(\d+):([A-Za-z0-9_-]+)$/.test(botToken)) {
          console.warn(`Пользователь с UID ${uid} имеет некорректный формат токена.`);
          continue;
        }

        const bot = new Telegraf(botToken);

        console.log(`Бот "${botName || 'Без имени'}" (UID: ${uid}) успешно создан.`);

        bot.on('text', async (ctx) => {
          const userMessage = ctx.message.text;
          const chatId = ctx.chat.id;

          console.log(`Получено текстовое сообщение от Chat ID ${chatId}: ${userMessage}`);

          if (!userMessage) {
            ctx.reply('Пожалуйста, отправьте текстовое сообщение.');
            return;
          }

          try {
            const productsSnapshot = await db
              .collection('Users')
              .doc(uid)
              .collection('Products')
              .get();

            const products = productsSnapshot.docs.map(doc => doc.data());

            const productInfo = products.length > 0
              ? `Товары, доступные для этого пользователя:\n` + products.map(product => {
                  return `${product.name} (${product.description}): ${product.price} ${userData.currency || 'USD'}`;
                }).join('\n')
              : 'Нет доступных товаров.';

            const messages = [
              { role: 'system', content: 'Ты бот-консультант, помогающий пользователям найти информацию о товарах.' },
              { role: 'user', content: `${productInfo}\nПользователь: ${userMessage}` }
            ];

            const aiResponse = await openai.chat.completions.create({
              model: 'gpt-4',
              messages: messages,
              max_tokens: 150,
              temperature: 0.7,
            });

            const aiText = aiResponse.choices[0].message.content.trim();

            ctx.reply(aiText);
          } catch (error) {
            console.error(`Ошибка при обработке текстового сообщения от Chat ID ${chatId}:`, error.response?.data || error.message || error);
            ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
          }
        });

        bot.on('voice', async (ctx) => {
          const chatId = ctx.chat.id;
          const fileId = ctx.message.voice.file_id;

          console.log(`Получено голосовое сообщение от Chat ID ${chatId}: File ID ${fileId}`);

          try {
            const fileLink = await ctx.telegram.getFileLink(fileId);

            const response = await axios.get(fileLink.href, { responseType: 'stream' });
            const tempDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'temp');
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
            const filePath = path.join(tempDir, `temp_${fileId}.ogg`);

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });

            const transcriptionResponse = await openai.audio.transcriptions.create({
              model: 'whisper-1',
              file: fs.createReadStream(filePath),
              language: 'ru',
            });

            const transcribedText = transcriptionResponse.text.trim();

            fs.unlinkSync(filePath);

            const productsSnapshot = await db
              .collection('Users')
              .doc(uid)
              .collection('Products')
              .get();

            const products = productsSnapshot.docs.map(doc => doc.data());

            const productInfo = products.length > 0
              ? `Товары, доступные для этого пользователя:\n` + products.map(product => {
                  return `${product.name} (${product.description}): ${product.price} ${userData.currency || 'USD'}`;
                }).join('\n')
              : 'Нет доступных товаров.';

            const messages = [
              { role: 'system', content: 'Ты бот-консультант, помогающий пользователям найти информацию о товарах.' },
              { role: 'user', content: `${productInfo}\nПользователь: ${transcribedText}` }
            ];

            const aiResponseFinal = await openai.chat.completions.create({
              model: 'gpt-4',
              messages: messages,
              max_tokens: 150,
              temperature: 0.7,
            });

            const aiTextFinal = aiResponseFinal.choices[0].message.content.trim();

            ctx.reply(aiTextFinal);
          } catch (error) {
            console.error(`Ошибка при обработке голосового сообщения от Chat ID ${chatId}:`, error.response?.data || error.message || error);
            ctx.reply('Не удалось обработать голосовое сообщение.');
          }
        });

        bot.launch()
          .then(() => {
            console.log(`Бот "${botName || 'Без имени'}" (UID: ${uid}) запущен и готов к работе.`);
          })
          .catch(error => {
            console.error(`Ошибка при запуске бота "${botName || 'Без имени'}" (UID: ${uid}):`, error);
          });

      } catch (error) {
        console.error(`Ошибка при обработке пользователя UID ${uid}:`, error);
      }
    }
  } catch (error) {
    console.error('Ошибка при инициализации ботов:', error);
  }
}
