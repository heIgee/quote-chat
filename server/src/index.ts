import express from 'express';
import cors from 'cors';

import { message } from './test.js';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({ message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
