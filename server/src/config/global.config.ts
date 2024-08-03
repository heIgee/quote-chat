import { configDotenv } from 'dotenv';

const inProduction = process.env.NODE_ENV === 'production';
const clientUri = inProduction
  ? 'https://quote-chat.vercel.app'
  : 'http://localhost:5173';

if (!inProduction) configDotenv();

const dbUrl = process.env.ATLAS_URL!;
const dbName = 'quote';

export { inProduction, clientUri, dbUrl, dbName };
