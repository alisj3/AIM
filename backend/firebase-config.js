import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';


const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountPath) {
  console.error('FIREBASE_SERVICE_ACCOUNT переменная окружения не установлена.');
  process.exit(1);
}


if (!fs.existsSync(path.resolve(serviceAccountPath))) {
  console.error(`Файл сервисного аккаунта не найден по пути: ${serviceAccountPath}`);
  process.exit(1);
}


admin.initializeApp({
  credential: admin.credential.cert(path.resolve(serviceAccountPath)),
});

const db = admin.firestore();

export default db;
