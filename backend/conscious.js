import db from './firebase-config.js';
import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAllBots() {
  const bots = [];
  try {
    const usersSnapshot = await db.collection('Users').get();

    if (usersSnapshot.empty) {
      return bots;
    }

    for (const userDoc of usersSnapshot.docs) {
      const botsSnapshot = await userDoc.ref.collection('Bots').get();

      if (botsSnapshot.empty) {
        continue;
      }

      for (const botDoc of botsSnapshot.docs) {
        const botDocData = botDoc.data();

        if (!botDocData.bots || !Array.isArray(botDocData.bots)) {
          continue;
        }

        botDocData.bots.forEach(bot => {
          if (!bot.token) {
            return;
          }

          bots.push({ uid: userDoc.id, botId: botDoc.id, ...bot });
        });
      }
    }
  } catch (error) {
    console.error('Ошибка при получении ботов из Firebase:', error);
  }
  return bots;
}

function insertParasiticWords(text, parasiticWords) {
  const words = text.split(' ');
  parasiticWords.forEach(word => {
    const insertPosition = Math.floor(Math.random() * words.length);
    words.splice(insertPosition, 0, word);
  });
  return words.join(' ');
}

function initializeTelegramBot(botConfig) {
  const bot = new TelegramBot(botConfig.token, { polling: true });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
      const systemPrompt = botConfig.botDescription;
      const userPrompt = `${botConfig.base}\nПользователь: ${userMessage}\nБот:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      let botReply = response.choices[0].message.content.trim();

      if (botConfig.parasiticWords) {
        const parasiticWordsArray = botConfig.parasiticWords.split(',').map(word => word.trim());
        botReply = insertParasiticWords(botReply, parasiticWordsArray);
      }

      if (botConfig.character.toLowerCase() === 'evil') {
        botReply = botReply.toUpperCase();
      } else if (botConfig.character.toLowerCase() === 'friendly') {
        botReply += ' 😊';
      }

      await bot.sendMessage(chatId, botReply);
    } catch (error) {
      console.error(`Ошибка обработки сообщения для бота "${botConfig.botName || 'Без имени'}":`, error);
      await bot.sendMessage(chatId, 'Произошла ошибка при обработке вашего сообщения.');
    }
  });

  console.log(`Бот "${botConfig.botName || 'Без имени'}" запущен.`);
}

export async function startConsicous() {
  const bots = await getAllBots();

  if (bots.length === 0) {
    console.log('Нет ботов для запуска.');
    return;
  }

  bots.forEach(botConfig => {
    initializeTelegramBot(botConfig);
  });
}
